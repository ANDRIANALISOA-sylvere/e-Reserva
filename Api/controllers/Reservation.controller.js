const Reservation = require("../models/Reservation.model");
const Room = require("../models/Rooms.model");
const UserModel = require("../models/User.model");

const AddReservation = async (req, res) => {
  const {
    room_id,
    user_id,
    reservation_date_time,
    end_time,
    reservation_status,
  } = req.body;

  try {
    const user = await UserModel.findById({ _id: user_id });

    if (!user) {
      return res.status(400).json("User not found");
    }
    const room = await Room.findById({ _id: room_id });

    if (!room) {
      return res.status(400).json("Room not found");
    }

    const startDate = new Date(reservation_date_time);
    const endDate = new Date(end_time);

    // Vérifier les réservations existantes pour la même salle et les dates chevauchantes
    const existingReservations = await Reservation.find({
      room_id,
      $or: [
        { reservation_date_time: { $lt: endDate, $gte: startDate } },
        { end_time: { $gt: startDate, $lte: endDate } },
        {
          reservation_date_time: { $lte: startDate },
          end_time: { $gte: endDate },
        },
      ],
    });

    if (existingReservations.length > 0) {
      return res.status(400).json({
        message: "The room is already reserved during the requested time.",
      });
    }

    const reservation = await Reservation.create({
      room_id,
      user_id,
      reservation_date_time: startDate,
      end_time: endDate,
      reservation_status,
    });

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: reservation,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the reservation" });
  }
};

const GetReservationByUser = async (req, res) => {
  const { user_id } = req.query;
  try {
    const user = await UserModel.findById({ _id: user_id });
    if (!user) {
      return res.status(400).json("User not found");
    }

    const reservation = await Reservation.find({ user_id });
    res.status(200).json({ reservation: reservation });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the reservation" });
  }
};

const GetAllReservation = async (req, res) => {
  try {
    const reservation = await Reservation.find({});
    res.status(200).json({ reservation });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the reservation" });
  }
};

const GetReservationById = async (req, res) => {
  const id = req.params.id;
  try {
    const reservation = await Reservation.findById({ _id: id });
    res.status(200).json({ reservation  : reservation});
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the reservation" });
  }
};

module.exports = {
  AddReservation,
  GetReservationByUser,
  GetAllReservation,
  GetReservationById
};
