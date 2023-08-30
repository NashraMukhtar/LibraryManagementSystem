const userModel = require("../models/userModel");
const bookModel = require("../models/bookModel");
const jwt = require("jsonwebtoken");
const refreshtokenModel = require("../models/refreshtokenModel");

//IsAdmin Auth
const ckeckAdmin = async (req, res, next) => {
  try {
    const user = req.user.user;
    if (!user) return res.status(400).json("User doesn't exists");
    if (
      user.user.isAdmin == false ||
      user.user.isAdmin == undefined ||
      user.user.isAdmin == null
    ) {
      return res.status(403).json("You are not an Admin");
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

//Token Auth Function
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("userController authToken Token: ", token);
  if (!token) return res.send("token is null");
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json(err);
    req.user = user;
    next();
  });
};

//Check RefreshToken to Get New AccessToken
/*const checkRefreshToken = async (req, res, next) => {
  try {
    const refreshtoken = req.body.refreshtoken;
    const isAvailable = await refreshtokenModel.findOne({
      refreshToken: refreshtoken,
    });
    if (refreshtoken == null)
      return res.status(401).json("refreshToken was not provided");
    console.log({ isAvailable });
    if (isAvailable == null)
      return res.status(401).json("You don't have access");
    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json(err);
      const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1800s",
      });
      res.status(200).json({ accessToken });
    });
  } catch (err) {
    next(err);
  }
};*/

//Register NEW User (prefer salting next time)
const newUser = async (req, res, next) => {
  try {
    const doesUserExists = await userModel.findOne({
      username: req.body.username,
    });
    if (doesUserExists) {
      return res
        .status(400)
        .json({ message: "User already exists. Choose a New Username" });
    }
    const user = await userModel.create(req.body);
    const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET);
    await refreshtokenModel.create({
      username: user.username,
      refreshToken: refreshToken,
    });
    res.status(200).json({ user: user, refreshToken: refreshToken });
  } catch (err) {
    next(err);
  }
};

//Delete User
const deleteUser = async (req, res, next) => {
  try {
    const username = req.body.username;
    await refreshtokenModel.findOneAndDelete({
      username: username,
    });
    await userModel.findOneAndDelete({ username: username });
    res.status(200).json({ message: "User and refreshToken Deleted" });
  } catch (err) {
    next(err);
  }
};

//GET User
const getUser = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

//BORROW Book
const borrowBook = async (req, res, next) => {
  const bookTitle = req.body.bookTitle;
  const userId = req.body.id;
  try {
    const book = await bookModel.findOne({ title: bookTitle });
    if (!book) {
      return res.status(404).json({ message: "book not found" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const exists = await bookModel.findOne({
      title: bookTitle,
      borrowedBy: userId,
    });
    if (exists != null) {
      return res.status(400).json({ message: "book already borrowed" });
    }
    await book.updateOne({ $push: { borrowedBy: userId } });
    await book.updateOne({
      quantity: book.quantity - 1,
    });
    const borrowedBook = await bookModel.find({ title: bookTitle });
    await userModel.findByIdAndUpdate(userId, {
      $push: {
        borrowedBooks: borrowedBook.id,
      },
    });
    return res.status(200).json({
      borrowedBook: borrowedBook,
      message: "Book Borrowed Successfully",
    });
  } catch (err) {
    next(err);
  }
};

//Returning a Book
const returnBook = async (req, res, next) => {
  try {
    const bookTitle = req.body.bookTitle;
    const userId = req.body.id;
    const book = await bookModel.findOne({ title: bookTitle });
    if (!book) {
      return res.status(404).json("book not found");
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json("user not found");
    }
    const isBorrowed = await bookModel.findOne({
      title: bookTitle,
      borrowedBy: userId,
    });
    if (isBorrowed == null) {
      return res.status(400).json("Borrow the Book first");
    }
    console.log(book._id);
    await book.updateOne({ $pull: { borrowedBy: userId } });
    await book.updateOne({ quantity: book.quantity + 1 });
    await user.updateOne({ $pull: { borrowedBooks: book._id } });
    const returnedBook = await bookModel.findOne({ title: bookTitle });
    // await userModel.findByIdAndUpdate(userId, {
    //   $pull: { borrowedBooks: bookTitle },
    // });
    return res.status(200).json(returnedBook);
  } catch (err) {
    next(err);
  }
};

//Borrowed Books by User
const borrowedBooksByUser = async (req, res, next) => {
  try {
    const user = req.user.user;
    const userId = user.user._id;
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
    const refreshtokenObject = await refreshtokenModel.findOne({
      username: givenUsername,
    });
    const refreshtoken = refreshtokenObject.refreshToken;
    const user = await userModel.findOne({ username: givenUsername });
    if (user == null) {
      return res.status(400).json("Incorrect Username. User Not Found ");
    }
    if (givenPassword != user.password) {
      return res.status(400).json("Incorrect password");
    }
    // console.log(user);
    // console.log("refreshtoken", refreshtoken);
    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json(err);
      const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7200s",
      });
      console.log("userController Login User", user);
      console.log("userController Login User.user", user.user);
      return res.status(200).json({
        user: user.user,
        token: token,
        refreshtoken: refreshtoken,
      });
    });

    /*const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1800s",
    });*/

    /*const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET);
    await refreshtokenModel.create({
      username: user.username,
      refreshToken: refreshToken,
    });*/

    // console.log("Access Token = " + token);
    // console.log("Refresh Token = " + refreshToken);
  } catch (err) {
    next(err);
  }
};

//User Logout

/*const logout = async (req, res, next) => {
  try {
    await refreshtokenModel.findOneAndDelete({
      username: req.body.username,
    });
    return res.status(200).json("Logged out successfully");
  } catch (err) {
    next;
  }
};*/

module.exports = {
  borrowBook,
  newUser,
  deleteUser,
  returnBook,
  borrowedBooksByUser,
  login,
  authenticateToken,
  // logout,
  // checkRefreshToken,
  ckeckAdmin,
  getUser,
};
