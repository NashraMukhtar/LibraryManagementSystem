const express = require("express");
const router = express.Router();
const {
  requestToBorrow,
  showAllRequests,
} = require("../controllers/reqController");

//Request to Borrow a Book
router.post("/borrowReq", requestToBorrow);

//Display All Requests
router.get("/showAll", showAllRequests);

module.exports = router;
