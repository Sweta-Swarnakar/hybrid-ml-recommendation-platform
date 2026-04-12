const express = require("express");
const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  getSingleBook,
} = require("../controllers/books.controller");

const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createBookValidation,
  updateBookValidation,
  idValidation,
} = require("../validations/book.validation");

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", idValidation, getSingleBook);

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
  idValidation,
  deleteBook
);

module.exports = router;