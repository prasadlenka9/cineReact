import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profilePhoto: { type: String, default: "" },
    favorites: { type: Array, default: [] },
    followers: { type: Array, default: [] },
    following: { type: Array, default: [] },
    topFavorites: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
