const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["proprietaire", "organisateur"] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
