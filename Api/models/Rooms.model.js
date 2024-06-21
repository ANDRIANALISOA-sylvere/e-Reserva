const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomSchema = new Schema({
  name: { type: String, required: true },
  owner_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  max_capacity: { type: Number, required: true },
  description: { type: String, required: true },
  equipments: { type: [String] },
  images: { type: [String], required: true },
});

module.exports = mongoose.model("Room", roomSchema);
