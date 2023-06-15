const express = require("express");
const router = express.Router();
const {
  borrowBook,
  newUser,
  returnBook,
  borrowedBooksByUser,
  login,
  authenticateToken,
  logout,
  checkRefreshToken,
} = require("../controllers/userController");

//ADD New User
router.post("/new-user", newUser);
//BORROW a Book
router.post("/borrow/:bookId", borrowBook);
//RETURN Borrowed Book
router.post("/return/:bookId", returnBook);
//GET Borrowed Books By User
router.get("/borrowed-books/", authenticateToken, borrowedBooksByUser);
//LOGIN
router.post("/login", login);
//Check Refresh Token
router.post("/checkrefreshtoken", checkRefreshToken);
//logout
router.delete("/logout", logout);

module.exports = router;
