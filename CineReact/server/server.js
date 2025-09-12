// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import multer from "multer";
// import path from "path";
// import userRoutes from "./routes/users.js";
// import { fileURLToPath } from "url";
// import User from "./models/User.js"; 
// import authMiddleware from "./middleware/auth.js";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// dotenv.config({ path: path.join(__dirname, ".env") });
// console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

// const app = express();

// app.use(cors()); 

// app.use(express.json());
// app.use("/api/users", userRoutes);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// if (!process.env.MONGO_URI) {
//   console.error("MONGO_URI missing. Check server/.env");
//   process.exit(1);
// }
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));


// const userSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: true, unique: true },
//     email: { type: String, unique: true, required: true },
//     passwordHash: { type: String, required: true },
//     profilePhoto: { type: String, default: "" },
//     topFavorites: { type: [{ id: String, title: String, poster: String }], default: [] }, 
//     followers: { type: [String], default: [] }, 
//     following: { type: [String], default: [] }, 
//   },
//   { timestamps: true }
// );
// const User = mongoose.models.User || mongoose.model("User", userSchema);




// const reviewSchema = new mongoose.Schema(
//   {
//     movieId: { type: String, required: true },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     rating: { type: Number, required: true },
//     review: { type: String, required: true },
//   },
//   { timestamps: true }
// );
// const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);



// const storage = multer.diskStorage({
//   destination: function (req, file, cb) { cb(null, path.join(__dirname, "uploads"));}, 
//   filename: function (req, file, cb) { const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + Date.now() + Date.now() + ext); },
// });
// function fileFilter(req, file, cb) {
//   if (file.mimetype.startsWith("image/")) cb(null, true);
//   else cb(new Error("Only image files are allowed"), false);
// }

// const upload = multer({ storage, fileFilter });




// const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });


// const authMiddleware = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "User not logged in" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id);
//     if (!req.user) return res.status(401).json({ message: "User not found" });
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };



// app.post("/api/auth/signup", async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     if (await User.findOne({ $or: [{ email }, { username }] })) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const salt = await bcrypt.genSalt(10);
//     const passwordHash = await bcrypt.hash(password, salt);
//     const user = new User({ username, email, passwordHash });
//     await user.save();
//     const token = generateToken(user._id);
//     res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.post("/api/auth/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const normalizedEmail = email.toLowerCase();
//     const user = await User.findOne({ email: normalizedEmail });
//     if (!user) {
//       console.log("Login failed: user not found");
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     console.log("Found user:", user.email);
//     const isMatch = await bcrypt.compare(password, user.passwordHash);
//     console.log("Password match:", isMatch);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     const token = generateToken(user._id);
//     res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });




// app.post("/api/users/profilePhoto", authenticateToken, upload.single("profilePhoto"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    
//     const user = await User.findById(req.user.id);
//     user.profilePhoto = req.file.filename; 
//     await user.save();

    
//     res.json({
//       username: user.username,
//       email: user.email,
//       profilePhoto: user.profilePhoto,
//       followers: user.followers,
//       following: user.following,
//       topFavorites: user.topFavorites,
//     });
//   } catch (err) {
//     console.error("profilePhoto error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });



// app.get("/api/users/username/:username", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.params.username }).select("-passwordHash").lean();
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const recentReviews = await Review.find({ user: user._id }).sort({ createdAt: -1 }).limit(5).lean();
//     const reviewCount = await Review.countDocuments({ user: user._id });
//     res.json({ user, recentReviews, reviewCount });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// app.post("/api/users/profilePhoto", authMiddleware, upload.single("profilePhoto"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     req.user.profilePhoto = req.file.filename;
//     await req.user.save();

    
//     res.json({
//       profilePhoto: req.user.profilePhoto,
//       username: req.user.username,
//       email: req.user.email,
//     });
//   } catch (err) {
//     console.error("Profile photo upload error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });




// app.post("/api/users/topFavorites/add", authMiddleware, async (req, res) => {
//   try {
//     const { movie } = req.body; 
//     if (!movie || !movie.id) return res.status(400).json({ message: "Invalid movie" });

//     const existing = req.user.topFavorites || [];
//     if (existing.find((m) => m.id === movie.id)) return res.status(400).json({ message: "Already in favorites" });

//     if (existing.length >= 3) return res.status(400).json({ message: "Max 3 favorites allowed" });

//     req.user.topFavorites.push(movie);
//     await req.user.save();
//     res.json(req.user.topFavorites);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to add favorite" });
//   }
// });


// app.post("/api/users/topFavorites/remove", authMiddleware, async (req, res) => {
//   try {
//     const { movieId } = req.body;
//     req.user.topFavorites = req.user.topFavorites.filter((m) => m.id !== movieId);
//     await req.user.save();
//     res.json(req.user.topFavorites);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to remove favorite" });
//   }
// });


// app.post("/api/users/follow/:username", authMiddleware, async (req, res) => {
//   try {
//     const target = await User.findOne({ username: req.params.username });
//     if (!target) return res.status(404).json({ message: "User to follow not found" });

//     if (req.user.username === target.username) return res.status(400).json({ message: "Cannot follow yourself" });

    
//     if (!req.user.following.includes(target.username)) {
//       req.user.following.push(target.username);
//       await req.user.save();
//     }
//     if (!target.followers.includes(req.user.username)) {
//       target.followers.push(req.user.username);
//       await target.save();
//     }

//     res.json({ following: req.user.following, followers: target.followers });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to follow user" });
//   }
// });


// app.post("/api/users/unfollow/:username", authMiddleware, async (req, res) => {
//   try {
//     const target = await User.findOne({ username: req.params.username });
//     if (!target) return res.status(404).json({ message: "User to unfollow not found" });

//     req.user.following = req.user.following.filter((u) => u !== target.username);
//     await req.user.save();

//     target.followers = target.followers.filter((u) => u !== req.user.username);
//     await target.save();

//     res.json({ following: req.user.following, followers: target.followers });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to unfollow user" });
//   }
// });


// app.post("/api/reviews", authMiddleware, async (req, res) => {
//   try {
//     const { movieId, rating, review } = req.body;
//     if (!rating || !review) return res.status(400).json({ message: "Rating and review required" });

//     const existing = await Review.findOne({ user: req.user._id, movieId });
//     if (existing) return res.status(400).json({ message: "You have already reviewed this movie" });

//     const newReview = new Review({ user: req.user._id, movieId, rating, review });
//     await newReview.save();
//     await newReview.populate("user", "username profilePhoto");
//     res.status(201).json(newReview);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to submit review" });
//   }
// });

// app.get("/api/reviews/:movieId", async (req, res) => {
//   try {
//     const reviews = await Review.find({ movieId: req.params.movieId })
//       .populate("user", "username profilePhoto")
//       .sort({ createdAt: -1 });
//     res.json(reviews);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch reviews" });
//   }
// });


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploads (not used now but safe to keep)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI missing in .env");
  process.exit(1);
}
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -------------------- Mongoose Models --------------------
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    topFavorites: { type: [{ id: String, title: String, poster: String }], default: [] },
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model("User", userSchema);

const reviewSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
  },
  { timestamps: true }
);
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

// -------------------- JWT --------------------
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// -------------------- Auth Routes --------------------
app.post("/api/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (await User.findOne({ $or: [{ email }, { username }] })) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- User Routes --------------------
// Get current logged-in user
app.get("/api/users/me", authMiddleware, async (req, res) => {
  const { _id, username, email, topFavorites, followers, following } = req.user;
  res.json({ id: _id, username, email, topFavorites, followers, following });
});

// Get other user by username
app.get("/api/users/username/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const recentReviews = await Review.find({ user: user._id }).sort({ createdAt: -1 }).limit(5).lean();
    const reviewCount = await Review.countDocuments({ user: user._id });
    res.json({ user, recentReviews, reviewCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Favorites ----------------
app.post("/api/users/topFavorites/add", authMiddleware, async (req, res) => {
  try {
    const { movie } = req.body;
    if (!movie || !movie.id) return res.status(400).json({ message: "Invalid movie" });

    if (req.user.topFavorites.find((m) => m.id === movie.id))
      return res.status(400).json({ message: "Already in favorites" });

    if (req.user.topFavorites.length >= 3)
      return res.status(400).json({ message: "Max 3 favorites allowed" });

    req.user.topFavorites.push(movie);
    await req.user.save();
    res.json(req.user.topFavorites);
  } catch (err) {
    console.error("Add fav error:", err);
    res.status(500).json({ message: "Failed to add favorite" });
  }
});

app.post("/api/users/topFavorites/remove", authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.body;
    req.user.topFavorites = req.user.topFavorites.filter((m) => m.id !== movieId);
    await req.user.save();
    res.json(req.user.topFavorites);
  } catch (err) {
    console.error("Remove fav error:", err);
    res.status(500).json({ message: "Failed to remove favorite" });
  }
});

// -------------------- Follow / Unfollow --------------------
app.post("/api/users/follow/:username", authMiddleware, async (req, res) => {
  try {
    const target = await User.findOne({ username: req.params.username });
    if (!target) return res.status(404).json({ message: "User to follow not found" });
    if (req.user.username === target.username)
      return res.status(400).json({ message: "Cannot follow yourself" });

    if (!req.user.following.includes(target.username)) req.user.following.push(target.username);
    if (!target.followers.includes(req.user.username)) target.followers.push(req.user.username);

    await req.user.save();
    await target.save();

    res.json({ following: req.user.following, followers: target.followers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to follow user" });
  }
});

app.post("/api/users/unfollow/:username", authMiddleware, async (req, res) => {
  try {
    const target = await User.findOne({ username: req.params.username });
    if (!target) return res.status(404).json({ message: "User to unfollow not found" });

    req.user.following = req.user.following.filter((u) => u !== target.username);
    target.followers = target.followers.filter((u) => u !== req.user.username);

    await req.user.save();
    await target.save();

    res.json({ following: req.user.following, followers: target.followers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to unfollow user" });
  }
});

// -------------------- Reviews --------------------
app.post("/api/reviews", authMiddleware, async (req, res) => {
  try {
    const { movieId, rating, review } = req.body;
    if (!rating || !review) return res.status(400).json({ message: "Rating and review required" });

    if (await Review.findOne({ user: req.user._id, movieId }))
      return res.status(400).json({ message: "Already reviewed this movie" });

    const newReview = new Review({ user: req.user._id, movieId, rating, review });
    await newReview.save();
    await newReview.populate("user", "username");
    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

app.get("/api/reviews/:movieId", async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).populate("user", "username").sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



