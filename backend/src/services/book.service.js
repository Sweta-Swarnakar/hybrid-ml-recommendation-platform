const bookRepository = require("../repositories/bookRepository");
const cache = require("./cache.service");

const inMemoryCache = {};

/**
 * GET ALL BOOKS
 */
exports.getBooks = async (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 5, 50);
  const cacheKey = `books:${page}:${limit}`;

  let cacheData;

  try {
    cacheData = await cache.get(cacheKey);
  } catch {
    console.warn("Redis down, using in-memory cache");
    cacheData = inMemoryCache[cacheKey] || null;
  }

  if (cacheData) {
    return { fromCache: true, ...cacheData };
  }

  const total = await bookRepository.countBooks();

  const books = await bookRepository.getBooks(page, limit);

  const totalPages = Math.ceil(total / limit);

  const response = {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    data: books,
  };

  try {
    await cache.set(cacheKey, response, 120);
  } catch {
    inMemoryCache[cacheKey] = response;
  }

  return { fromCache: false, ...response };
};

/**
 * GET SINGLE BOOK
 */
exports.getSingleBook = async (bookId) => {
  const cacheKey = `book:${bookId}`;

  let cached;

  try {
    cached = await cache.get(cacheKey);
  } catch {
    cached = inMemoryCache[cacheKey];
  }

  if (cached) {
    return { fromCache: true, data: cached };
  }

  const book = await bookRepository.getBookById(bookId);

  if (!book) {
    const err = new Error("Book not found");
    err.statusCode = 404;
    throw err;
  }

  try {
    await cache.set(cacheKey, book, 120);
  } catch {
    inMemoryCache[cacheKey] = book;
  }

  return { fromCache: false, data: book };
};

/**
 * ADD BOOK
 */
exports.addBook = async (body, user, file, image) => {
  const { title, author, description, genre, rating, fileUrl, imageUrl } = body;

  if (!file && !fileUrl) {
    throw new Error("Book file required");
  }

  if (!image && !imageUrl) {
    throw new Error("Image required");
  }

  const book = await bookRepository.createBook({
    title,
    author,
    description,
    genre,
    rating,
    fileUrl: file ? file.path : fileUrl,
    imageUrl: image ? image.path : imageUrl,
    createdBy: user._id,
  });

  // clear cache
  try {
    await cache.delPattern("books:*");
  } catch {
    Object.keys(inMemoryCache).forEach((k) => delete inMemoryCache[k]);
  }

  return {
    success: true,
    message: "Book added successfully",
    data: book,
  };
};

/**
 * UPDATE BOOK
 */
exports.updateBook = async (bookId, body, file, image) => {
  const existingBook = await bookRepository.findById(bookId);

  if (!existingBook || existingBook.isDeleted) {
    const err = new Error("Book not found");
    err.statusCode = 404;
    throw err;
  }

  const allowedFields = [
    "title",
    "author",
    "description",
    "genre",
    "rating",
    "imageUrl",
    "fileUrl",
  ];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  });

  if (file) {
    updateData.fileUrl = file.path;
  }

  if (image) {
    updateData.imageUrl = image.path;
  }

  const updatedBook = await bookRepository.updateBook(
    bookId,
    updateData
  );

  // clear cache
  try {
    await cache.delPattern("books:*");
    await cache.del(`book:${bookId}`);
  } catch {
    Object.keys(inMemoryCache).forEach((k) => delete inMemoryCache[k]);
  }

  return {
    success: true,
    message: "Book updated successfully",
    data: updatedBook,
  };
};

/**
 * DELETE BOOK (Soft Delete)
 */
exports.deleteBook = async (bookId) => {
  const book = await bookRepository.findById(bookId);

  if (!book || book.isDeleted) {
    const err = new Error("Book not found");
    err.statusCode = 404;
    throw err;
  }

  await bookRepository.softDelete(bookId);

  // clear cache
  try {
    await cache.delPattern("books:*");
    await cache.del(`book:${bookId}`);
  } catch {
    console.warn("Cache clear failed");
  }

  return {
    success: true,
    message: "Book deleted successfully (soft delete)",
  };
};