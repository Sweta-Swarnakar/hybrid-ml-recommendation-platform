// src/routes/book.routes.js
const express = require("express");
const router = express.Router();

const { getBooks, addBook, updateBook, deleteBook, getSingleBook } = require("../controllers/books.controller");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware");

router.get("/", protect, getBooks);
router.post("/", protect, authorizeRoles("admin"), addBook);
router.put("/:id", protect, authorizeRoles("admin"), updateBook);
router.delete("/delete/:id", protect, authorizeRoles("admin"), deleteBook);
router.get("/:id", protect, getSingleBook);
module.exports = router;
