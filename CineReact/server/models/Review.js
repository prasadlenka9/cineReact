// server/models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    movieId: {
      type: String,
      required: true, // TMDB movie ID
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    reviewText: {
      type: String,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
