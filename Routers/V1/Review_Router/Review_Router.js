const express = require("express");
const reviewController = require("../../../Controller/Review_Controller/Review_Controller");
const router = express.Router();

// review post --------------
router.route("/")
    .post(reviewController.reviewPost)
    // review get ----------------
    .get(reviewController.reviewGet)

module.exports = router;
