// src/routes/book.routes.js
const express = require("express");
const router = express.Router();

const { getBooks } = require("../controllers/books.controller");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware");

router.get("/", protect, getBooks);


module.exports = router;
