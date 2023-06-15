const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    min: 1,
  },
  price: {
    type: String,
  },
  borrowedBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "userModel",
  },
});
module.exports = mongoose.model("books", bookSchema);
