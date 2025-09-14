// server/routes/reviews.js
import express from "express";
import Review from "../models/Review.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add a review
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { movieId, rating, reviewText } = req.body;
    const review = new Review({
      movieId,
      user: req.user.id,
      rating,
      reviewText,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Error submitting review" });
  }
});

// ✅ Get all reviews for a movie
router.get("/:movieId", async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).populate(
      "user",
      "username profilePhoto"
    );
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// ✅ Delete a review (only by owner)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review" });
  }
});

export default router;
