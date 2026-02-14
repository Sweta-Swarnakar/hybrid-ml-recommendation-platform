// src/app.js
const express = require("express");
const healthRoutes = require("./routes/health.routes");
const bookRoutes = require("./routes/book.routes");

const app = express();

app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/books", bookRoutes);

module.exports = app;
