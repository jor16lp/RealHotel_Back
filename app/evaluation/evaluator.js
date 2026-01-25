import ratingsRepository from "../repositories/ratingsRepository.js";
import hotelsRepository from "../repositories/hotelsRepository.js";
import { initDB } from "../repositories/connection.js";

import {
  precisionAtK,
  recallAtK,
  ndcgAtK,
  ndcgAtKFromGains
} from "./metrics.js";

// let city = 'Madrid';

// =====================================================
// EVALUATE ONE SYSTEM (TRADICIONAL o IA)
// =====================================================
export async function evaluateSystem(systemName, recommendFn, k = 10) {
  initDB();

  const ratings = await ratingsRepository.getAll();
  const users = [...new Set(ratings.map(r => r.userEmail))];

  const results = [];

  for (const userEmail of users) {
    const userRatings = ratings.filter(r => r.userEmail === userEmail);

    // Necesitamos datos suficientes
    if (userRatings.length < 4) continue;

    // Shuffle ratings
    const shuffled = [...userRatings].sort((a,b) => a.hotelName.localeCompare(b.hotelName));

    // Relevantes = hoteles bien valorados
    const relevantHotelNames = shuffled
      .filter(r => r.rating >= 4)
      .map(r => r.hotelName);

    if (relevantHotelNames.length === 0) continue;

    // Obtener info real de hoteles relevantes
    const relevantHotels = await hotelsRepository.getByNames(relevantHotelNames);

    // Ciudades relevantes (desde hoteles, NO desde ratings)
    const relevantCities = new Set(
      relevantHotels
        .map(h => h.city)
        .filter(Boolean)
        .map(c => c.toLowerCase())
    );
    const city = [...relevantCities][0] || null; 

    // Obtener recomendaciones
    let recommendations = [];
    try {
      recommendations = await recommendFn(userEmail, city);
    } catch (err) {
      console.error("Error recommending for", userEmail, err.message);
      continue;
    }

    if (!recommendations.length) continue;

    // Evaluación con relevancia contextual
    const recommendedNames = recommendations.map(h => h.name);

    const gains = recommendations.map(h => {
      if (relevantHotelNames.includes(h.name)) return 1;
      if (h.city && relevantCities.has(h.city.toLowerCase())) return 0.3;
      return 0;
    });

    const hits = recommendations.filter(h =>
        relevantHotelNames.includes(h.name)
    );

    // ---------------- LOG CONTROLADO ----------------
    console.log("\n==============================");
    console.log("USER:", userEmail);
    console.log("Relevant hotels:", relevantHotelNames);
    console.log("Relevant cities:", [...relevantCities]);
    console.log("Recommended:", recommendedNames);
    console.log("Hits:", hits.map(h => h.name));
    // ------------------------------------------------

    results.push({
      precision: precisionAtK(
        recommendedNames,
        hits.map(h => h.name),
        k
      ),
      recall: recallAtK(
        recommendedNames,
        hits.map(h => h.name),
        k
      ),
      ndcg: ndcgAtKFromGains(gains, k)
    });
  }

  // Media de métricas
  const avg = metric =>
    results.reduce((s, r) => s + r[metric], 0) / (results.length || 1);

  return {
    system: systemName,
    precision: Number(avg("precision").toFixed(3)),
    recall: Number(avg("recall").toFixed(3)),
    ndcg: Number(avg("ndcg").toFixed(3)),
    usersEvaluated: results.length
  };
}
