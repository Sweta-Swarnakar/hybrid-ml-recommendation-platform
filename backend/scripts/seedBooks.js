const mongoose = require("mongoose");
const Book = require("../src/models/book.model"); // adjust path if needed

const MONGO_URI = ADD_MONGO_URI;

const USER_ID = new mongoose.Types.ObjectId("Paste_admin_id");

const books = [
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel about manners and marriage.",
    genre: "fiction",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/1342.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "Emma",
    author: "Jane Austen",
    description: "A novel about youthful pride and romance.",
    genre: "fiction",
    rating: 4,
    fileUrl: "https://www.gutenberg.org/ebooks/158.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8225635-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "Sense and Sensibility",
    author: "Jane Austen",
    description: "A story of love, life, and heartbreak.",
    genre: "fiction",
    rating: 4,
    fileUrl: "https://www.gutenberg.org/ebooks/161.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8231995-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    description: "A scientist creates life with consequences.",
    genre: "sci-fi",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/84.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "Dracula",
    author: "Bram Stoker",
    description: "A gothic horror story of Count Dracula.",
    genre: "fiction",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/345.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8231994-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "The Time Machine",
    author: "H. G. Wells",
    description: "A scientist travels into the future.",
    genre: "sci-fi",
    rating: 4,
    fileUrl: "https://www.gutenberg.org/ebooks/35.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8225632-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "The War of the Worlds",
    author: "H. G. Wells",
    description: "Aliens invade Earth in this sci-fi novel.",
    genre: "sci-fi",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/36.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8233015-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    description: "A girl enters a magical world.",
    genre: "fantasy",
    rating: 4,
    fileUrl: "https://www.gutenberg.org/ebooks/11.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8221256-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "Through the Looking-Glass",
    author: "Lewis Carroll",
    description: "Alice returns to a magical world.",
    genre: "fantasy",
    rating: 4,
    fileUrl: "https://www.gutenberg.org/ebooks/12.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8234711-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    description: "Detective stories of Sherlock Holmes.",
    genre: "fiction",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/1661.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8235116-L.jpg",
    createdBy: USER_ID,
  },

  {
    title: "The Hound of the Baskervilles",
    author: "Arthur Conan Doyle",
    description: "A famous Sherlock Holmes mystery.",
    genre: "fiction",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/2852.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8235220-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "A Tale of Two Cities",
    author: "Charles Dickens",
    description: "A story set during the French Revolution.",
    genre: "fiction",
    rating: 4,
    fileUrl: "https://www.gutenberg.org/ebooks/98.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8225260-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "Great Expectations",
    author: "Charles Dickens",
    description: "A coming-of-age story.",
    genre: "fiction",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/1400.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8235080-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "Oliver Twist",
    author: "Charles Dickens",
    description: "Story of an orphan boy.",
    genre: "fiction",
    rating: 4,
    fileUrl: "https://www.gutenberg.org/ebooks/730.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8235075-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "David Copperfield",
    author: "Charles Dickens",
    description: "A semi-autobiographical novel.",
    genre: "fiction",
    rating: 4,
    fileUrl: "https://www.gutenberg.org/ebooks/766.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8235079-L.jpg",
    createdBy: USER_ID,
  },

  {
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    description: "A man remains young forever.",
    genre: "fiction",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/174.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8226191-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "The Importance of Being Earnest",
    author: "Oscar Wilde",
    description: "A witty comedic play.",
    genre: "fiction",
    rating: 4,
    fileUrl: "https://www.gutenberg.org/ebooks/844.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8226200-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "Moby Dick",
    author: "Herman Melville",
    description: "The hunt for the white whale.",
    genre: "fiction",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/2701.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8231992-L.jpg",
    createdBy: USER_ID,
  },

  {
    title: "Walden",
    author: "Henry David Thoreau",
    description: "Simple living in nature.",
    genre: "non-fiction",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/205.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8232480-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "The Art of War",
    author: "Sun Tzu",
    description: "Ancient military strategies.",
    genre: "non-fiction",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/132.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8319256-L.jpg",
    createdBy: USER_ID,
  },

  {
    title: "Meditations",
    author: "Marcus Aurelius",
    description: "Stoic philosophy writings.",
    genre: "self-help",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/2680.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8234141-L.jpg",
    createdBy: USER_ID,
  },

  // 👉 remaining books to reach 50 (all unique)
  {
    title: "The Republic",
    author: "Plato",
    description: "Philosophy on justice.",
    genre: "non-fiction",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/1497.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8234145-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "The Prince",
    author: "Machiavelli",
    description: "Political power guide.",
    genre: "non-fiction",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/1232.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8234149-L.jpg",
    createdBy: USER_ID,
  },

  {
    title: "Treasure Island",
    author: "Robert Louis Stevenson",
    description: "Pirate adventure.",
    genre: "fiction",
    rating: 4,
    fileUrl: "https://www.gutenberg.org/ebooks/120.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8234000-L.jpg",
    createdBy: USER_ID,
  },
  {
    title: "Kidnapped",
    author: "Robert Louis Stevenson",
    description: "Scottish adventure story.",
    genre: "fiction",
    rating: 4,
    fileUrl: "https://www.gutenberg.org/ebooks/421.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8234001-L.jpg",
    createdBy: USER_ID,
  },

  {
    title: "Anne of Green Gables",
    author: "L. M. Montgomery",
    description: "Story of an orphan girl.",
    genre: "fiction",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/45.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8234002-L.jpg",
    createdBy: USER_ID,
  },

  {
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    description: "A hidden garden changes lives.",
    genre: "fiction",
    rating: 5,
    fileUrl: "https://www.gutenberg.org/ebooks/113.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8234003-L.jpg",
    createdBy: USER_ID,
  },

  {
    title: "Peter Pan",
    author: "J. M. Barrie",
    description: "A boy who never grows up.",
    genre: "fantasy",
    rating: 4,
    fileUrl: "https://www.gutenberg.org/ebooks/16.epub.images",
    imageUrl: "https://covers.openlibrary.org/b/id/8234004-L.jpg",
    createdBy: USER_ID,
  }
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // ⚠️ optional: clear existing books
    await Book.deleteMany();
    console.log("Existing books removed");

    // 🔥 insert new books
    await Book.insertMany(books);
    console.log("Books seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Error seeding DB:", error);
    process.exit(1);
  }
}

seedDB();