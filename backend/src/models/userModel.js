const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: { type: String },
  },
  email: {
    type: String,
    min: 10,
  },
  password: {
    type: { type: String },
  },
  phone: {
    type: Number,
    min: 9,
  },
  gender: {
    type: String,
  },
  borrowedBooks: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "bookModel",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("users", userSchema);
