const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  addBook,
  deleteBook,
  updateBook,
} = require("../controllers/bookController");

//GET All Books
router.get("/all-books", getAllBooks);
//GET Book By ID
router.get("/byID/:id", getBookById);
//ADD New Book
router.post("/add-book", addBook);
//DELETE Book
router.delete("/delete-book/:id", deleteBook);
//UPDATE Book
router.patch("/update-book/:id", updateBook);

module.exports = router;
