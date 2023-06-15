const mongoose = require("mongoose");
const connectdb = async () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/", {
      dbName: "LMS",
      useNewUrlParser: true,
    })
    .then(console.log("Connected to DB"))
    .catch((err) => console.log(err));
};
module.exports = connectdb;
