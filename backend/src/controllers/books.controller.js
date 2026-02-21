const Book = require("../models/book.model");
const cache = require("../services/cache.service");

const inMemoryCache = {};

/**
 * GET ALL BOOKS
 * Pagination + Cache
 */
const getBooks = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 5, 50);
    const cacheKey = `books:${page}:${limit}`;

    let cacheData;

    try {
      cacheData = await cache.get(cacheKey);
    } catch {
      console.warn("Redis down, using in-memory cache");
      cacheData = inMemoryCache[cacheKey] || null;
    }

    if (cacheData) {
      return res.json({ fromCache: true, ...cacheData });
    }

    const total = await Book.countDocuments({ isDeleted: false });

    const books = await Book.find({ isDeleted: false })
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

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

    res.json({ fromCache: false, ...response });
  } catch (error) {
    next(error);
  }
};

/**
 * GET SINGLE BOOK
 */
const getSingleBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const cacheKey = `book:${bookId}`;

    let cached;

    try {
      cached = await cache.get(cacheKey);
    } catch {
      cached = inMemoryCache[cacheKey];
    }

    if (cached) {
      return res.json({ fromCache: true, data: cached });
    }

    const book = await Book.findOne({
      _id: bookId,
      isDeleted: false,
    })
      .populate("createdBy", "firstName lastName email")
      .lean();

    if (!book) {
      const err = new Error("Book not found");
      err.statusCode = 404;
      return next(err);
    }

    try {
      await cache.set(cacheKey, book, 120);
    } catch {
      inMemoryCache[cacheKey] = book;
    }

    res.json({ fromCache: false, data: book });
  } catch (error) {
    next(error);
  }
};

/**
 * ADD BOOK
 * Admin Only
 */
const addBook = async (req, res, next) => {
  try {
    const { title, author, description, genre, rating } = req.body;

    if (!title || !author || !description || !genre) {
      const err = new Error("All required fields must be provided");
      err.statusCode = 400;
      return next(err);
    }

    const book = await Book.create({
      title,
      author,
      description,
      genre,
      rating,
      createdBy: req.user._id,
    });

    // clear list cache
    try {
      await cache.delPattern("books:*");
    } catch {
      Object.keys(inMemoryCache).forEach((k) => delete inMemoryCache[k]);
    }

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE BOOK
 * Admin Only
 */
const updateBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    const existingBook = await Book.findById(bookId);

    if (!existingBook || existingBook.isDeleted) {
      const err = new Error("Book not found");
      err.statusCode = 404;
      return next(err);
    }

    // ✅ Field Whitelisting (Security Fix)
    const allowedFields = [
      "title",
      "author",
      "description",
      "genre",
      "rating",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("createdBy", "firstName lastName email");

    // clear caches
    try {
      await cache.delPattern("books:*");
      await cache.del(`book:${bookId}`);
    } catch {
      Object.keys(inMemoryCache).forEach((k) => delete inMemoryCache[k]);
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE BOOK (Soft Delete)
 * Admin Only
 */
const deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findById(bookId);

    if (!book || book.isDeleted) {
      const err = new Error("Book not found");
      err.statusCode = 404;
      return next(err);
    }

    book.isDeleted = true;
    await book.save();

    // clear caches
    try {
      await cache.delPattern("books:*");
      await cache.del(`book:${bookId}`);
    } catch {
      console.warn("Cache clear failed");
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully (soft delete)",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getSingleBook,
  addBook,
  updateBook,
  deleteBook,
};