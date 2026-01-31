// src/app.js
const express = require("express");
const healthRoutes = require("./routes/health.routes");

const app = express();

// middleware to parse JSON
app.use(express.json());

module.exports = app;

app.use("/api", healthRoutes);
