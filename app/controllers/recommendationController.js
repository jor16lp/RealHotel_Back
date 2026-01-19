import { getHybridRecommendations } from "../services/recommendationService.js";
// const evaluateRecommender = require("../scripts/evaluateRecommender");

export const getRecommendations = async (req, res) => {
  try {
    const { userEmail, baseHotelName, city, limit } = req.body;
    const hotels = await getHybridRecommendations(userEmail, baseHotelName, city, limit);
    res.json(hotels);
  } catch (err) {
    console.error("Error al obtener recomendaciones:", err);
    res.status(500).json({ message: "Error obteniendo recomendaciones", error: err });
  }
};

// exports.evaluateRecommender = async (req, res) => {
//   try {
//     const x = await evaluateRecommender.evaluate();
//     // res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ message: "Error al actualizar usuario", error: err });
//   }
// };