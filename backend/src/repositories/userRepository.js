// repositories/bookRepository.js
const Book = require('../models/book');

exports.findAll = async (query) => {
  return await Book.find(query);
};

exports.create = async (data) => {
  return await Book.create(data);
};