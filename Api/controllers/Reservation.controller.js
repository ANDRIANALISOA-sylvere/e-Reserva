const Reservation = require("../models/Reservation.model");
const Room = require("../models/Rooms.model");
const UserModel = require("../models/User.model");

const AddReservation = async (req, res) => {
  const { room_id, user_id, date_debut, end_date, reservation_status } =
    req.body;

  console.log(date_debut, end_date);

  try {
    const user = await UserModel.findById(user_id);
    if (!user) {
      return res.status(400).json("User not found");
    }

    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(400).json("Room not found");
    }

    // Vérifier les réservations existantes pour la même salle et les dates chevauchantes
    const existingReservations = await Reservation.find({
      room_id,
      $or: [
        { date_debut: { $lt: end_date }, end_date: { $gt: date_debut } },
        { date_debut: { $gte: date_debut, $lt: end_date } },
        { end_date: { $gt: date_debut, $lte: end_date } },
      ],
    });

    if (existingReservations.length > 0) {
      return res.json({
        erreur: "La salle est déjà réservée pour la période demandée.",
      });
    }

    const reservation = await Reservation.create({
      room_id,
      user_id,
      date_debut,
      end_date,
      reservation_status,
    });

    res.status(201).json({
      message: "Réservation créée avec succès",
      reservation: reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la création de la réservation.",
    });
  }
};

const GetReservationByUser = async (req, res) => {
  const { user_id } = req.query;
  try {
    const user = await UserModel.findById({ _id: user_id });
    if (!user) {
      return res.status(400).json("User not found");
    }

    const reservation = await Reservation.find({ user_id })
      .populate("room_id")
      .populate("user_id");
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
    res.status(200).json({ reservation: reservation });
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
  GetReservationById,
};
