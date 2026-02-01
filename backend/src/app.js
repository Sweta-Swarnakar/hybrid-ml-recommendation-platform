// src/app.js
const express = require("express");
const healthRoutes = require("./routes/health.routes");
const bookRoutes = require("./routes/book.routes");

const app = express();

// middleware to parse JSON
app.use(express.json());

// routes
app.use("/api", healthRoutes);
app.use("/api/books", bookRoutes);

module.exports = app;
