const Book = require("../models/book.model");

/**
 * COUNT BOOKS (for pagination)
 */
exports.countBooks = async () => {
  return await Book.countDocuments({ isDeleted: false });
};

/**
 * GET BOOKS WITH PAGINATION
 */
exports.getBooks = async (page, limit) => {
  return await Book.find({ isDeleted: false })
    .populate("createdBy", "firstName lastName email")
    .sort({ createdAt: -1 }) //newest first
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};

/**
 * GET SINGLE BOOK BY ID
 */
exports.getBookById = async (bookId) => {
  return await Book.findOne({
    _id: bookId,
    isDeleted: false,
  })
    .populate("createdBy", "firstName lastName email")
    .lean();
};

/**
 * FIND BY ID (used for update/delete checks)
 */
exports.findById = async (bookId) => {
  return await Book.findById(bookId);
};

/**
 * CREATE BOOK
 */
exports.createBook = async (data) => {
  return await Book.create(data);
};

/**
 * UPDATE BOOK
 */
exports.updateBook = async (bookId, updateData) => {
  return await Book.findByIdAndUpdate(
    bookId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).populate("createdBy", "firstName lastName email");
};

/**
 * SOFT DELETE
 */
exports.softDelete = async (bookId) => {
  return await Book.findByIdAndUpdate(bookId, {
    isDeleted: true,
  });
};