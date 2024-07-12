const express = require("express");
const {
  AddReservation,
  GetReservationByUser,
  GetAllReservation,
  GetReservationById,
  getReservationsByRoomId,
  confirmReservation,
  cancelReservation,
} = require("../controllers/Reservation.controller");
const router = express.Router();

router.get("/reservations/all", GetAllReservation);
router.get("/reservations", GetReservationByUser);
router.get("/reservations/:id", GetReservationById);
router.get("/reservations/room/:roomId", getReservationsByRoomId);
router.post("/reservations", AddReservation);
router.patch("/reservations/:id/confirm", confirmReservation);
router.patch("/reservations/:id/cancel", cancelReservation);

module.exports = router;
