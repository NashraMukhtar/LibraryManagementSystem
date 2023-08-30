const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  getBookByTitle,
  addBook,
  deleteBook,
  updateBook,
} = require("../controllers/bookController");
const {
  ckeckAdmin,
  authenticateToken,
} = require("../controllers/userController");

//GET All Books
router.get("/all-books", getAllBooks);
//GET Book By ID
router.get("/by-title/:title", getBookByTitle);
//ADD New Book
router.post("/add-book", authenticateToken, ckeckAdmin, addBook);
//DELETE Book
router.delete("/delete-book", authenticateToken, ckeckAdmin, deleteBook);
//UPDATE Book
router.patch("/update-book", authenticateToken, ckeckAdmin, updateBook);

module.exports = router;
