const { books } = require("../bookMockData");
exports.getBooks = (req, res) => {
  console.log("Received request for books with query:", req);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedBooks = books.slice(start, end);
  console.log(`Fetched books`, paginatedBooks);
  res.json({
    page,
    limit,
    total: books.length,
    data: paginatedBooks
  });
};
