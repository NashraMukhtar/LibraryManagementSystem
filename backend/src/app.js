require("dotenv").config();
const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const connectdb = require("./db");
const bookRoute = require("./routes/bookRoute");
const userRoute = require("./routes/userRoute");
const requestRoute = require("./routes/requestRoute");

var cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/request", requestRoute);

connectdb().then(
  app.listen("8000", () => {
    console.log("Listening on port 8000");
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});
