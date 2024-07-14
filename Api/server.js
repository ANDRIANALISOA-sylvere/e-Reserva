const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const UserRoute = require("./routes/User.route");
const RoomRoute = require("./routes/Room.route");
const ReservationRoute = require("./routes/Reservation.route");
const ReviewRouter = require("./routes/Review.route");
const FavorisRouter = require("./routes/Favoris.route");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use("/api", UserRoute);
app.use("/api", RoomRoute);
app.use("/api", ReservationRoute);
app.use("/api", ReviewRouter);
app.use("/api", FavorisRouter);

app.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
});
