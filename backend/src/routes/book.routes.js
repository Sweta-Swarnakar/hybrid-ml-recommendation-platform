const express = require("express");
const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  getSingleBook,
  getRecommendations
} = require("../controllers/books.controller");

const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  createBookValidation,
  updateBookValidation,
  idValidation,
} = require("../validations/book.validation");

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", idValidation, getSingleBook);
router.get("/:id/recommendations", idValidation, getRecommendations);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createBookValidation,
  validate,
   upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  addBook
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateBookValidation,
  validate,
   upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
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