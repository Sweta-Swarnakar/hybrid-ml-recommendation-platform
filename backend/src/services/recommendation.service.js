const axios = require("axios");
const Book = require("../models/book.model");
const cache = require("./cache.service");

const ML_URL = process.env.ML_URL || "http://localhost:8000";

exports.getRecommendations = async (bookId) => {
  const cacheKey = `recommendations:${bookId}`;

  // 1. Cache
  const cached = await cache.get(cacheKey);
  if (cached) {
    console.log("⚡ Recommendation cache hit");
    return cached;
  }

  // 2. DB
  const books = await Book.find({ isDeleted: false })
    .select("_id description genre")
    .limit(200);

  const targetBook = books.find((b) => b._id.toString() === bookId);

  if (!targetBook) throw new Error("Book not found");

  // 3. ML call
  let recommendations = [];

  try {
    const response = await axios.post(`${ML_URL}/recommend`, {
      book_id: bookId,
      books: books.map((b) => ({
        id: b._id.toString(),
        description: b.description,
        genre: b.genre,
      })),
    });

    // ML returns IDs

    const ids = response.data.recommendations;

    // map IDs → full book objects
    recommendations = books.filter((b) => ids.includes(b._id.toString()));
  } catch (err) {
    console.error("ML failed:", err.message);
  }

  // 4. Cache only if valid
  if (recommendations.length > 0) {
    await cache.set(cacheKey, recommendations, 1800);
  }

  return recommendations;
};
