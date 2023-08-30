const express = require("express");
const router = express.Router();
const {
  borrowBook,
  newUser,
  deleteUser,
  returnBook,
  borrowedBooksByUser,
  login,
  authenticateToken,
  // logout,
  // checkRefreshToken,
  getUser,
} = require("../controllers/userController");

//ADD New User
router.post("/new-user", newUser);
//DELETE User
router.delete("/delete-user", deleteUser);
//GET User
router.get("/get-user", authenticateToken, getUser);
//BORROW a Book
router.post("/borrow", borrowBook);
//RETURN Borrowed Book
router.post("/return", returnBook);
//GET Borrowed Books By User
router.get("/borrowed-books", authenticateToken, borrowedBooksByUser);
//LOGIN
router.post("/login", login);
//Check Refresh Token
// router.post("/checkrefreshtoken", checkRefreshToken);
//logout
// router.delete("/logout", logout);

module.exports = router;
