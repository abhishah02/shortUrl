const mongoose = require("mongoose");

//User Schema
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
  },
  { timestamps: true }
);

const User = mongoose.model("admin", UserSchema);

module.exports = User;
