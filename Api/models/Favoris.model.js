const mongoose = require("mongoose");

const FavorisSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    favoris: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

FavorisSchema.index({ user_id: 1, room_id: 1 }, { unique: true });

const Favoris = mongoose.model("Favoris", FavorisSchema);

module.exports = Favoris;
