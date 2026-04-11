// controllers/book.controller.js

const bookService = require("../services/book.service");

/**
 * GET ALL BOOKS
 */
const getBooks = async (req, res, next) => {
  try {
    const data = await bookService.getBooks(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET SINGLE BOOK
 */
const getSingleBook = async (req, res, next) => {
  try {
    const data = await bookService.getSingleBook(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * ADD BOOK
 */
const addBook = async (req, res, next) => {
  try {
    const data = await bookService.addBook(req.body, req.user);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE BOOK
 */
const updateBook = async (req, res, next) => {
  try {
    const data = await bookService.updateBook(
      req.params.id,
      req.body
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE BOOK
 */
const deleteBook = async (req, res, next) => {
  try {
    const data = await bookService.deleteBook(req.params.id);
    res.status(200).json(data);
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