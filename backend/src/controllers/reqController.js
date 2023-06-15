const requestModel = require("../models/requestModel");

//Request FROM User to Borrow a Book
const requestToBorrow = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const bookId = req.body.bookId;
    const request = await requestModel.create({ user: userId, book: bookId });
    res.status(200).json(request);
  } catch (err) {
    next(err);
  }
};

//Display All Requests To Librarian
const showAllRequests = async (req, res, next) => {
  try {
    const requests = await requestModel.find();
    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
};

module.exports = { requestToBorrow, showAllRequests };
