const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  status: {
    type: String,
    required: true,
    default: "not Approved",
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "bookModel",
  },
});
module.exports = mongoose.model("request", requestSchema);
