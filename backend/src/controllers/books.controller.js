const { books } = require("../data/bookMockData");
const cache = require("../services/cache.service");

// in-memory fallback cache
const inMemoryCache = {};

exports.getBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const cacheKey = `books:${page}:${limit}`;

  let cacheData;
  try {
    cacheData = await cache.get(cacheKey); // Redis
  } catch (err) {
    console.warn("Redis unavailable, using in-memory cache", err);
    cacheData = inMemoryCache[cacheKey] || null;
  }

  if (cacheData) {
    return res.json({
      fromCache: true,
      ...cacheData,
    });
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const response = {
    page,
    limit,
    total: books.length,
    data: books.slice(start, end),
  };

  try {
    await cache.set(cacheKey, response, 120); // TTL 2 mins
  } catch (err) {
    inMemoryCache[cacheKey] = response;
  }

  res.json({
    fromCache: false,
    ...response,
  });
};
