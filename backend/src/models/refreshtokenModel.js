const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
});
module.exports = mongoose.model("refreshTokens", tokenSchema);
