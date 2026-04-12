const bookService = require("../services/book.service");
const asyncHandler = require("../utils/asyncHandler");

const getBooks = asyncHandler(async (req, res) => {
  const data = await bookService.getBooks(req.query);
  res.json(data);
});

const getSingleBook = asyncHandler(async (req, res) => {
  const data = await bookService.getSingleBook(req.params.id);
  res.json(data);
});

const addBook = asyncHandler(async (req, res) => {
  const file = req.files?.file?.[0];
  const image = req.files?.image?.[0];

  const data = await bookService.addBook(
    req.body,
    req.user,
    file,
    image
  );

  res.status(201).json(data);
});

const updateBook = asyncHandler(async (req, res) => {
  const file = req.files?.file?.[0];
  const image = req.files?.image?.[0];

  const data = await bookService.updateBook(
    req.params.id,
    req.body,
    file,
    image
  );

  res.status(200).json(data);
});

const deleteBook = asyncHandler(async (req, res) => {
  const data = await bookService.deleteBook(req.params.id);
  res.status(200).json(data);
});

module.exports = {
  getBooks,
  getSingleBook,
  addBook,
  updateBook,
  deleteBook,
};