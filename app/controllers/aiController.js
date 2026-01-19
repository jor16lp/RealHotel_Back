import { estimateRatingFromComment, getHybridAIRecommendations } from "../services/aiService.js";
import { getHybridRecommendations } from "../services/recommendationService.js";
import hotelsService from "../services/hotelsService.js";

export const estimateRating = async (req, res) => {
  try {
    const { comment } = req.body;
    const rating = await estimateRatingFromComment(comment);
    res.json(rating);
  } catch (err) {
    console.error("Error al obtener puntuación del comentario:", err);
    res.status(500).json({ message: "Error obteniendo puntuación del comentario", error: err });
  }
};

export const getFinalRecommendations = async (req, res) => {
  const { userEmail, city } = req.params;
  const normalizedCity = city?.trim();

  // -----------------------------
  // 1. Intentar IA (solo si hay ciudad)
  // -----------------------------
  if (normalizedCity) {
    try {
      const recs = await getHybridAIRecommendations(userEmail, normalizedCity);

      // CASO 1: IA responde con hoteles
      if (Array.isArray(recs) && recs.length > 0) {
        return res.json({
          source: "IA",
          recommendations: recs
        });
      }

      // CASO 2: IA responde pero vacío
      console.warn("IA respondió pero no devolvió resultados");
      
      console.log("A")
    } catch (err) {
      console.log("B")

      // CASO 3: IA falla (tokens, timeout, proveedor...)
      console.error("Fallo en IA, usando fallback tradicional por ciudad:", err.message);

      try {
        const hotelsByCity = await getHybridRecommendations(
          userEmail,
          null,
          normalizedCity,
          10
        );

        return res.json({
          source: "TRADICIONAL",
          recommendations: hotelsByCity
        });

      } catch (e) {
        console.error("Error en fallback tradicional por ciudad:", e.message);
        return res.status(500).json({
          message: "Error obteniendo recomendaciones",
          error: e.message
        });
      }
    }
  }

  // -----------------------------
  // 2. Fallback general (CASO 2 y CASO 4)
  // - IA vacía
  // - Ciudad inexistente
  // -----------------------------
  console.log("C")
  try {
    const hotelsGeneral = await getHybridRecommendations(
      userEmail,
      null,
      null,
      10
    );

    return res.json({
      source: "NO CIUDAD",
      recommendations: hotelsGeneral
    });

  } catch (e) {
    console.error("Error en sistema tradicional general:", e.message);
    return res.status(500).json({
      message: "Error obteniendo recomendaciones",
      error: e.message
    });
  }
};
