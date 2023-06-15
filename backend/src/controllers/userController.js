const userModel = require("../models/userModel");
const bookModel = require("../models/bookModel");
const jwt = require("jsonwebtoken");
const refreshtokenModel = require("../models/refreshtokenModel");

//Token Auth Function
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.send("token is null");
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json(err);
    req.user = user;
    console.log(req.user);
    next();
  });
};

//Check RefreshToken to Get New AccessToken
const checkRefreshToken = async (req, res, next) => {
  try {
    const refreshtoken = req.body.refreshtoken;
    const isAvailable = await refreshtokenModel.findOne({
      refreshToken: refreshtoken,
    });
    if (refreshtoken == null)
      return res.status(401).json("token was not provided");
    console.log({ isAvailable });
    if (isAvailable == null)
      return res.status(401).json("You don't have access");
    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json(err);
      const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "60s",
      });
      res.status(200).json({ accessToken });
    });
  } catch (err) {
    next(err);
  }
};

//Register NEW User (prefer salting next time)
const newUser = async (req, res, next) => {
  try {
    // const user = await userModel.create({
    //   username: "malaika",
    //   email: "abns@gmail",
    //   password: "abc1234",
    //   phone: 1234567890,
    //   gender: "female",
    // });
    // console.log(user);
    const user = await userModel.findOne({ username: req.body.username });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists. Choose a New Username" });
    }
    const newUser = await userModel.create(req.body);
    res.status(200).json(newUser);
  } catch (err) {
    next(err);
  }
};

//BORROW Book
const borrowBook = async (req, res, next) => {
  const bookId = req.params.bookId;
  const userId = req.body.id;
  try {
    const book = await bookModel.findById(bookId);
    if (!book) {
      return res.status(404).json("book not found");
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json("user not found");
    }
    const exists = await bookModel.findOne({ _id: bookId, borrowedBy: userId });
    if (exists != null) {
      return res.status(400).json("book already borrowed");
    }
    await book.updateOne({ $push: { borrowedBy: userId } });
    await book.updateOne({
      quantity: book.quantity - 1,
    });
    const borrowedBook = await bookModel.findById(bookId);
    await userModel.findByIdAndUpdate(userId, {
      $push: {
        borrowedBooks: bookId,
      },
    });
    return res.status(200).json(borrowedBook);
  } catch (err) {
    next(err);
  }
};

//Returning a Book
const returnBook = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    const userId = req.body.id;
    const book = await bookModel.findById(bookId);
    if (!book) {
      return res.status(404).json("book not found");
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json("user not found");
    }
    const isBorrowed = await bookModel.findOne({
      _id: bookId,
      borrowedBy: userId,
    });
    if (isBorrowed == null) {
      return res.status(400).json("Borrow the Book first");
    }
    await book.updateOne({ $pull: { borrowedBy: userId } });
    await book.updateOne({ quantity: book.quantity + 1 });
    await user.updateOne({ $pull: { borrowedBooks: bookId } });
    const returnedBook = await bookModel.findById(bookId);
    // await userModel.findByIdAndUpdate(userId, {
    //   $pull: { borrowedBooks: bookId },
    // });
    return res.status(200).json(returnedBook);
  } catch (err) {
    next(err);
  }
};

//Borrowed Books by User
const borrowedBooksByUser = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;
    const borrowedBooks = await bookModel.find({ borrowedBy: userId });
    if (borrowedBooks == null) {
      return res.status(404).json("No borrowed books found");
    }
    return res.status(200).json(borrowedBooks);
  } catch (err) {
    next(err);
  }
};

//User Login
const login = async (req, res, next) => {
  try {
    const givenUsername = req.body.username;
    const givenPassword = req.body.password;
    const user = await userModel.findOne({ username: givenUsername });
    if (user == null) {
      return res.status(400).json("Incorrect Username. User Not Found ");
    }
    if (givenPassword != user.password) {
      return res.status(400).json("Incorrect password");
    }
    const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "60s",
    });
    const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET);
    await refreshtokenModel.create({ refreshToken: refreshToken });
    console.log("Access Token = " + token);
    console.log("Refresh Token = " + refreshToken);
    return res.status(200).json({ user: user, token: token });
  } catch (err) {
    next(err);
  }
};

//User Logout
const logout = async (req, res, next) => {
  try {
    await refreshtokenModel.findOneAndDelete({
      refreshToken: req.body.refreshtoken,
    });
    return res.status(200).json("Logged out successfully");
  } catch (err) {
    next;
  }
};

module.exports = {
  borrowBook,
  newUser,
  returnBook,
  borrowedBooksByUser,
  login,
  authenticateToken,
  logout,
  checkRefreshToken,
};
