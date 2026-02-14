// src/app.js
const express = require("express");
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/book.routes");

const app = express();

app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
