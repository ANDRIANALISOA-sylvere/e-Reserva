const mongoose = require("mongoose");
const { Schema } = mongoose;

const reservationSchema = new Schema(
  {
    room_id: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date_debut: { type: Date, required: true },
    end_date: { type: Date, required: true },
    reservation_status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);
