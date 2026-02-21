const { body, param } = require("express-validator");

const createBookValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("author")
    .trim()
    .notEmpty()
    .withMessage("Author is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("genre")
    .trim()
    .notEmpty()
    .withMessage("Genre is required"),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
];

const updateBookValidation = [
  param("id").isMongoId().withMessage("Invalid book ID"),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
];

module.exports = {
  createBookValidation,
  updateBookValidation,
};