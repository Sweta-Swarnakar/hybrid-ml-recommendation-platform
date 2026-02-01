// src/routes/book.routes.js
const express = require("express");
const router = express.Router();

const { getBooks } = require("../controllers/books.controller");

router.get("/", getBooks);


module.exports = router;
