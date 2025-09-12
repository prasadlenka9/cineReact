// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   passwordHash: { type: String, required: true },
//   profilePhoto: { type: String },
//   coverPhoto: { type: String },
// });

// const User = mongoose.models.User || mongoose.model("User", userSchema);

// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  topFavorites: [
    {
      id: { type: String },
      title: { type: String },
      poster: { type: String },
    },
  ],
  followers: [{ type: String }], // store usernames for simplicity
  following: [{ type: String }],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
