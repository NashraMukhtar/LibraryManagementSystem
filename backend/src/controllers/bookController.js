const bookModel = require("../models/bookModel");

//GET All Books
const getAllBooks = async (req, res, next) => {
  try {
    const books = await bookModel.find();
    if (!books) {
      return res.status(404).json({ message: "No Books Found" });
    }
    return res.status(200).json(
      books.map((book) => {
        return book.toJSON();
      })
    );
  } catch (err) {
    next(err);
  }
};

//GET Book by Title
const getBookByTitle = async (req, res, next) => {
  try {
    const book = await bookModel.findOne({ title: req.params.title });
    if (!book) {
      return res.status(404).json("Book not Found");
    }
    return res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

//Add New Book
const addBook = async (req, res, next) => {
  try {
    const book = await bookModel.findOne({ title: req.body.title });
    if (book) {
      return res.status(400).json({ message: "Book Already Exists" });
    }
    const newBook = await bookModel.create(req.body);
    return res.status(200).json({ book: newBook });
  } catch (err) {
    next(err);
  }
};

//Delete Book
const deleteBook = async (req, res, next) => {
  try {
    const book = await bookModel.findOneAndDelete({ title: req.body.title });
    if (!book) {
      return res.status(404).json("Book not Found");
    }
    return res.status(200).json({ message: "Book Deleted Successfully" });
  } catch (err) {
    next(err);
  }
};

//UPDATE Book
const updateBook = async (req, res, next) => {
  try {
    const book = await bookModel.findOneAndUpdate(
      { title: req.body.title },
      req.body,
      {
        new: true,
      }
    );
    if (!book) {
      return res.status(404).json("Book not Found");
    }
    return res.status(200).json({ book: book });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllBooks,
  getBookByTitle,
  addBook,
  deleteBook,
  updateBook,
};
