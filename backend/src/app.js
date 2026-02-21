const express = require("express");
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/book.routes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;