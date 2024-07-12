const express = require("express");
const {
  AddReservation,
  GetReservationByUser,
  GetAllReservation,
  GetReservationById,
  getReservationsByRoomId,
} = require("../controllers/Reservation.controller");
const router = express.Router();

router.get("/reservations/all", GetAllReservation);
router.get("/reservations", GetReservationByUser);
router.get("/reservations/:id", GetReservationById);
router.get("/reservations/room/:roomId", getReservationsByRoomId);
router.post("/reservations", AddReservation);

module.exports = router;
