const Favoris = require('../models/Favoris.model');

const favorisController = {
  updateFavoris: async (req, res) => {
    try {
      const { userId, roomId, isFavoris } = req.body;
      
      const favori = await Favoris.findOneAndUpdate(
        { user_id: userId, room_id: roomId },
        { favoris: isFavoris },
        { upsert: true, new: true }
      ).populate('user_id room_id');

      res.status(200).json(favori);
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de la mise à jour des favoris", error: error.message });
    }
  },

  estDansFavoris: async (req, res) => {
    try {
      const { userId, roomId } = req.params;
      const favori = await Favoris.findOne({ user_id: userId, room_id: roomId })
        .populate('user_id room_id');
      
      res.status(200).json({ estFavori: favori ? favori.favoris : false });
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de la vérification des favoris", error: error.message });
    }
  },

  listeFavorisUtilisateur: async (req, res) => {
    try {
      const { userId } = req.params;
      const favoris = await Favoris.find({ user_id: userId, favoris: true })
        .populate('user_id room_id');
      
      res.status(200).json(favoris);
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de la récupération des favoris", error: error.message });
    }
  }
};

module.exports = favorisController;