const bookRepository = require('../repositories/bookRepository');

exports.getAllBooks = async (query) => {
  return await bookRepository.findAll(query);
};

exports.createBook = async (data) => {
  return await bookRepository.create(data);
};