const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    genre: {
      type: String,
      enum: ["fiction", "non-fiction", "sci-fi", "fantasy", "self-help"],
      required: [true, "Genre is required"],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    fileUrl: {
    	type: String,
    	required: false,
    },
    imageUrl: {
      type: String,
      required: false,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to user model
      required: true,
    },
		isDeleted: {
  		type: Boolean,
  		default: false
		}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
