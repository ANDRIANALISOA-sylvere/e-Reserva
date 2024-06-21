const express = require("express");
const { AddReview, ReviewOfRoom } = require("../controllers/Review.controller");
const router = express.Router();

router.get("/reviews", ReviewOfRoom);
router.post("/reviews", AddReview);

module.exports = router;
