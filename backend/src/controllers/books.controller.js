const { books } = require("../data/bookMockData");
let cache = {};
exports.getBooks = (req, res) => {
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const cacheKey = `books-${page}-${limit}`;
  if (cache[cacheKey]) {
    return res.json({
      fromCache: true,
      ...cache[cacheKey],
    });
  } 
    const start = (page - 1) * limit;
    const end = start + limit;
    const response = res.json({
      page,
      limit,
      total: books.length,
      data: books.slice(start, end)
    });
    cache[cacheKey] = response;
  

  res.json({
    fromCache: false,
    ...response,
  });
};
