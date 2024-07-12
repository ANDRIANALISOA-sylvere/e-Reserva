const ReviewModel = require("../models/Review.model");
const RoomsModel = require("../models/Rooms.model");
const UserModel = require("../models/User.model");

const AddReview = async (req, res) => {
  const { room_id, user_id, rating, comment } = req.body;

  try {
    const room = await RoomsModel.findById({ _id: room_id });
    const user = await UserModel.findById({ _id: user_id });

    if (!room) {
      return res.status(400).json("Room not found");
    }
    if (!user) {
      return res.status(400).json("User not found");
    }

    const review = new ReviewModel({
      room_id,
      user_id,
      rating,
      comment,
    });

    await review.save();

    const populatedReview = await ReviewModel.findById(review._id).populate(
      "user_id"
    );
    res.status(200).json({ review: populatedReview });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Failed to add review" });
  }
};

const ReviewOfRoom = async (req, res) => {
  const { room_id } = req.query;
  try {
    const room = await RoomsModel.findById(room_id);
    if (!room) {
      return res.status(400).json("Room not found");
    }

    const reviews = await ReviewModel.find({ room_id: room_id }).populate("user_id");
    const reviewCount = await ReviewModel.countDocuments({ room_id: room_id });

    const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviewCount > 0 ? ratingSum / reviewCount : 0;

    res.status(200).json({ 
      reviews: reviews,
      reviewCount: reviewCount,
      averageRating: Number(averageRating.toFixed(1))
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

module.exports = {
  AddReview,
  ReviewOfRoom,
};
