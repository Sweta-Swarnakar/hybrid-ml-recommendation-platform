const Book = require("../models/book.model");

exports.getRecommendations = async (bookId) => {
  const books = await Book.find({ isDeleted: false });

  const targetBook = books.find(b => b._id.toString() === bookId);

  if (!targetBook) throw new Error("Book not found");

  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();

  books.forEach(book => {
    tfidf.addDocument(book.description);
  });

  const scores = [];

  tfidf.tfidfs(targetBook.description, (i, measure) => {
    let score = measure;

    // boost if same genre
    if (books[i].genre === targetBook.genre) {
      score += 1;
    }

    scores.push({
      book: books[i],
      score,
    });
  });

  const recommendations = scores
    .filter(item => item.book._id.toString() !== bookId)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.book);

  return recommendations;
};