const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const UserRoute = require("./routes/User.route");
const RoomRoute = require("./routes/Room.route");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", UserRoute);
app.use("/api", RoomRoute);

app.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
});
