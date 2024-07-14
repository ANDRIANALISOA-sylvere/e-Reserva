const express = require("express");
const router = express.Router();
const favorisController = require("../controllers/Favoris.controller");

router.post("/update", favorisController.updateFavoris);

router.get("/check/:userId/:roomId", favorisController.estDansFavoris);

router.get("/list/:userId", favorisController.listeFavorisUtilisateur);

module.exports = router;
