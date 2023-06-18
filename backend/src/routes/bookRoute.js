const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  getBookById,
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
router.get("/byID/:id", getBookById);
//ADD New Book
router.post("/add-book", authenticateToken, ckeckAdmin, addBook);
//DELETE Book
router.delete("/delete-book/:id/", authenticateToken, ckeckAdmin, deleteBook);
//UPDATE Book
router.patch("/update-book/:id/", authenticateToken, ckeckAdmin, updateBook);

module.exports = router;
