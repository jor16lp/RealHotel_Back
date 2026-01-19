import ratingsRepository from "../repositories/ratingsRepository.js";
import hotelsRepository from "../repositories/hotelsRepository.js";


// -----------------------------------------------------------------------------------------------------------------
// SIMILITUD COSENO GENÉRICA
function cosineSimilarity(a, b) {
  const keys = Object.keys(a).filter(k => k in b);
  if (keys.length === 0) return 0;

  const dot = keys.reduce((sum, k) => sum + a[k] * b[k], 0);
  const normA = Math.sqrt(Object.values(a).reduce((s, x) => s + x * x, 0));
  const normB = Math.sqrt(Object.values(b).reduce((s, x) => s + x * x, 0));

  return dot / (normA * normB);
}

// -----------------------------------------------------------------------------------------------------------------
// SISTEMA COLABORATIVO
async function getCollaborativeScores(userEmail, city = null) {
  // Obtener todas las valoraciones
  const ratings = await ratingsRepository.getAll();

  // Construir matriz usuario → hotel
  const matrix = {};
  for (const r of ratings) {
    if (!matrix[r.userEmail]) matrix[r.userEmail] = {};
    matrix[r.userEmail][r.hotelName] = r.rating;
  }

  const targetRatings = matrix[userEmail];
  if (!targetRatings || Object.keys(targetRatings).length < 3) return null;

  // Calcular similitud entre usuarios
  const similarities = Object.entries(matrix)
    .filter(([email]) => email !== userEmail)
    .map(([email, ratings]) => ({
      email,
      similarity: cosineSimilarity(targetRatings, ratings)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);

  // Calcular puntuaciones ponderadas de hoteles no valorados
  const recommended = {};
  for (const { email, similarity } of similarities) {
    for (const [hotel, rating] of Object.entries(matrix[email])) {
      if (!(hotel in targetRatings)) {
        if (!recommended[hotel]) recommended[hotel] = 0;
        recommended[hotel] += rating * similarity;
      }
    }
  }

  // FILTRO POR CIUDAD (si aplica)
  if (city) {
    const cities = await hotelsRepository.getCities();
    const cityExists = cities.includes(city);
    if (cityExists) {
      const hotelNames = Object.keys(recommended);
      if (hotelNames.length === 0) return recommended;
      const hotels = await hotelsRepository.getByNames(hotelNames);
      const allowed = new Set(
        hotels
        .filter(h => h.city?.toLowerCase() === city.toLowerCase())
        .map(h => h.name)
      );
      
      const filtered = {};
      for (const [name, score] of Object.entries(recommended)) {
        if (allowed.has(name)) {
          filtered[name] = score;
        }
      }
      return filtered;
    }
  }

  return recommended;
}

// -----------------------------------------------------------------------------------------------------------------
// SISTEMA BASADO EN CONTENIDO
async function getContentScores({ userEmail, baseHotelName, city }) {
  let referenceVector;

  // Basado en usuario
  if (userEmail) {
    const ratings = await ratingsRepository.getByUser(userEmail);
    if (!ratings.length) return null;

    const hotels = await hotelsRepository.getByNames(
      ratings.map(r => r.hotelName)
    );

    referenceVector = {
      stars: hotels.reduce((s, h) => s + (h.stars || 0), 0) / hotels.length,
      avgPrice: hotels.reduce((s, h) => s + (h.averagePrice || 0), 0) / hotels.length,
    };
  }

  // Basado en hotel
  if (baseHotelName) {
    const hotel = await hotelsRepository.getByName(baseHotelName);
    if (!hotel) return null;

    referenceVector = {
      stars: hotel.stars || 0,
      avgPrice: hotel.averagePrice || 0,
    };
  }

  let candidates = [];
  if (city) {
    const cities = await hotelsRepository.getCities();
    const cityExists = cities.includes(city);
    if (cityExists) {
      candidates = await hotelsRepository.getByCity(city);
    }
  } else {
    candidates = await hotelsRepository.getAll();
  }

  const scores = {};
  for (const h of candidates) {
    if (h.name === baseHotelName) continue;

    const vector = {
      stars: h.stars || 0,
      avgPrice: h.averagePrice || 0,
    };

    scores[h.name] = cosineSimilarity(referenceVector, vector);
  }

  return scores;
}

export const getHybridRecommendations = async (userEmail, baseHotelName, city, limit = 10 ) => {
  if (!userEmail && !baseHotelName) {
    throw new Error("Debe indicarse userEmail o baseHotelName");
  }

  let finalScores = {};

  // --------------------------------------------------
  // 1 CONTENIDO
  // --------------------------------------------------
  const contentScores = await getContentScores({
    userEmail,
    baseHotelName,
    city: null // ⚠️ NO filtrar aún
  });

  if (!contentScores) return [];

  // --------------------------------------------------
  // 2 SOLO HOTEL → SOLO CONTENIDO
  // --------------------------------------------------
  if (!userEmail) {
    finalScores = contentScores;
  } else {
    // --------------------------------------------------
    // 3 COLABORATIVO
    // --------------------------------------------------
    const collaborativeScores = await getCollaborativeScores(userEmail, null);

    // Cold start
    if (!collaborativeScores || Object.keys(collaborativeScores).length < 3) {
      finalScores = contentScores;
    } else {
      // --------------------------------------------------
      // 4 HÍBRIDO
      // --------------------------------------------------
      const alpha = 0.6;
      const allHotels = new Set([
        ...Object.keys(contentScores),
        ...Object.keys(collaborativeScores)
      ]);

      for (const name of allHotels) {
        finalScores[name] =
          alpha * (collaborativeScores[name] || 0) +
          (1 - alpha) * (contentScores[name] || 0);
      }
    }
  }

  // --------------------------------------------------
  // 5 FILTRO POR CIUDAD (SIN ROMPER SCORES)
  // --------------------------------------------------
  if (city) {
    const hotelsInCity = await hotelsRepository.getByCity(city);
    const allowedNames = new Set(hotelsInCity.map(h => h.name));

    const filtered = {};
    for (const [name, score] of Object.entries(finalScores)) {
      if (allowedNames.has(name)) {
        filtered[name] = score;
      }
    }

    // fallback si la ciudad existe pero no hay matches
    if (Object.keys(filtered).length > 0) {
      finalScores = filtered;
    }
  }

  // --------------------------------------------------
  // 6 RANKING FINAL
  // --------------------------------------------------
  const topNames = Object.entries(finalScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);

  return hotelsRepository.getByNames(topNames);
};


