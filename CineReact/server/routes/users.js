
import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js"; 
import { authMiddleware } from "../middleware/auth.js"; 

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });


router.post("/profilePhoto", authMiddleware, upload.single("profilePhoto"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("No file received");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File received:", req.file.filename);
    console.log("User ID:", req.user._id);

    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    
    user.profilePhoto = req.file.filename;
    await user.save();

    console.log("User updated successfully");

    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      profilePhoto: user.profilePhoto,
      topFavorites: user.topFavorites,
      followers: user.followers,
      following: user.following,
    });
  } catch (err) {
    console.error("Profile photo upload error:", err);
    res.status(500).json({ message: "Server error while uploading photo" });
  }
});

export default router;
