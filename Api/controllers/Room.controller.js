const multer = require("multer");
const Room = require("../models/Rooms.model");
const User = require("../models/User.model");
const ReservationModel = require("../models/Reservation.model");

const AddRoom = async (req, res) => {
  const { name, owner_id, max_capacity, price, description, equipments } =
    req.body;
  let images = [];

  if (req.files) {
    images = req.files.map((file) => `http://192.168.43.149:5000/${file.path}`);
  }

  console.log(
    name,
    owner_id,
    max_capacity,
    price,
    description,
    equipments,
    images
  );

  try {
    await Room.create({
      name,
      owner_id,
      max_capacity,
      price,
      description,
      equipments: equipments.split(","),
      images,
    });

    res.status(200).json({ msg: "Room has been successfully registered" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while adding the room." });
  }
};

const GetRoomByOwner = async (req, res) => {
  const { owner_id } = req.query;
  try {
    const owner = await User.findById({ _id: owner_id });
    if (!owner) {
      return res.status(400).json("User not exists");
    }

    const rooms = await Room.find({ owner_id });

    const roomsWithReservationCount = await Promise.all(
      rooms.map(async (room) => {
        const reservationCount = await ReservationModel.countDocuments({
          room_id: room._id,
        });
        return {
          ...room.toObject(),
          reservationCount,
        };
      })
    );

    res.status(200).json({ rooms: roomsWithReservationCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while fetching rooms" });
  }
};

const GetAllRoom = async (req, res) => {
  try {
    const rooms = await Room.find({}).populate("owner_id");
    res.status(200).json({ rooms });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while fetching rooms" });
  }
};

const GetRoomById = async (req, res) => {
  const id = req.params.id;
  try {
    const room = await Room.findById({ _id: id }).populate("owner_id");

    if (!room) {
      return res.status(400).json("Room not found");
    }

    res.status(200).json({ room });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while fetching room" });
  }
};
module.exports = {
  AddRoom,
  GetRoomByOwner,
  GetAllRoom,
  GetRoomById,
};
