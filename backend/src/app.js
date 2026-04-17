const express = require("express");
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/book.routes");
const readerRoutes = require("./routes/reader.routes");
const errorHandler = require("./middlewares/error.middleware");

const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(helmet()); //adds security headers to stop script injection and iframe attacks

const allowedOrigins = ["http://localhost:5173"]
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL)

app.use(cors({
  origin: allowedOrigins,
})); // Only my frontend allowed to make calls to the backend
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max requests per IP
});

app.use(limiter);


app.use("/api", healthRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reader", readerRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
