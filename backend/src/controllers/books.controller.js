const Book = require("../models/book.model");
const cache = require("../services/cache.service");

// in-memory fallback cache
const inMemoryCache = {};

// GET ALL BOOKS - with pagination and cache
const getBooks = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 5, 50);
  const cacheKey = `books:${page}:${limit}`;

  let cacheData;

  // try redis cache
  try {
    cacheData = await cache.get(cacheKey);
  } catch (err) {
    console.warn("Redis down, using in-memory cache");
    cacheData = inMemoryCache[cacheKey] || null;
  }

  if (cacheData) {
    return res.json({ fromCache: true, ...cacheData });
  }

  try {
    const total = await Book.countDocuments({ isDeleted: false });

    const books = await Book.find({ isDeleted: false })
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const response = { page, limit, total, data: books };

    // save to cache
    try {
      await cache.set(cacheKey, response, 120);
    } catch {
      inMemoryCache[cacheKey] = response;
    }

    res.json({ fromCache: false, ...response });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching books",
      error: error.message,
    });
  }
};

// ADD BOOK (admin)
const addBook = async (req, res) => {
  try {
    const { title, author, description, genre, rating } = req.body;

    if (!title || !author || !description || !genre) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const book = await Book.create({
      title,
      author,
      description,
      genre,
      rating,
      createdBy: req.user._id,
    });

    // clear list cache after add
    try {
      await cache.delPattern("books:*");
    } catch {
      Object.keys(inMemoryCache).forEach(k => delete inMemoryCache[k]);
    }

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding book",
      error: error.message,
    });
  }
};

// UPDATE BOOK (admin)
const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    let book = await Book.findById(bookId);

    if (!book || book.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    book = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "firstName lastName email");

    // clear caches after update
    try {
      await cache.delPattern("books:*");
      await cache.del(`book:${bookId}`);
    } catch {
      Object.keys(inMemoryCache).forEach(k => delete inMemoryCache[k]);
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating book",
      error: error.message,
    });
  }
};

// DELETE BOOK (soft delete) - admin only
const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete books",
      });
    }

    const book = await Book.findById(bookId);

    if (!book || book.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
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
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET SINGLE BOOK
const getSingleBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const cacheKey = `book:${bookId}`;

    let cached;
    try {
      cached = await cache.get(cacheKey);
    } catch {
      cached = inMemoryCache[cacheKey];
    }

    if (cached) return res.json({ fromCache: true, data: cached });

    const book = await Book.findOne({ _id: bookId, isDeleted: false })
      .populate("createdBy", "firstName lastName email")
      .lean();

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    try {
      await cache.set(cacheKey, book, 120);
    } catch {
      inMemoryCache[cacheKey] = book;
    }

    res.json({ fromCache: false, data: book });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching book",
    });
  }
};

module.exports = {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  getSingleBook,
};
