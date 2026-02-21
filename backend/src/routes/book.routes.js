const express = require("express");
const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  getSingleBook,
} = require("../controllers/books.controller");

const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createBookValidation,
  updateBookValidation,
} = require("../validations/book.validation");

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getSingleBook);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createBookValidation,
  validate,
  addBook
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateBookValidation,
  validate,
  updateBook
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteBook
);

module.exports = router;