const express = require("express");
const {
  AddRoom,
  GetRoomByOwner,
  GetAllRoom,
  GetRoomById,
} = require("../controllers/Room.controller");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Configuration de stockage des images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filtrer les fichiers pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/avif") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limite de taille de 5MB
  fileFilter: fileFilter,
});

router.get("/rooms/all", GetAllRoom);
router.get("/rooms", GetRoomByOwner);
router.get("/rooms/:id", GetRoomById);
router.post("/rooms", upload.array("images", 5), AddRoom);

module.exports = router;
