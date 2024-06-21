const mongoose = require("mongoose");
const { Schema } = mongoose;

const reservationSchema = new Schema({
  room_id: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reservation_date_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  reservation_status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
