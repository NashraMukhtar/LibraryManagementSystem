const mongoose = require("mongoose");

const statuses = Object.freeze({
  WAITING: "waiting",
  APPROVED: "approved",
  REJECTED: "rejected",
});

const requestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(statuses),
    default: statuses.WAITING,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "bookModel",
  },
});
module.exports = mongoose.model("request", requestSchema);
