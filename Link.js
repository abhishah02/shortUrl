const mongoose = require("mongoose");

//User Schema
const UserSchema = new mongoose.Schema(
  {
    url: { type: String, require: true, unique: true },
    shortenUrl: { type: String, require: true },
    shortUrl: { type: String, require: true },
    click: { type: Number, require: true },
    isDelete: { type: Number, default: 0 },
    uid: { type: String, require: true },
  },
  { timestamps: true }
);

const Link = mongoose.model("link", UserSchema);

module.exports = Link;
