import "dotenv/config";

import { evaluateSystem } from "./evaluator.js";

import { getHybridRecommendations } from "../services/recommendationService.js";
import { getHybridAIRecommendations } from "../services/aiService.js";

// ===============================
// RUN EXPERIMENTS
// ===============================
async function runExperiments() {
  const results = [];

  // -------------------------------
  // TRADICIONAL
  // -------------------------------
  console.log("Evaluando sistema tradicional...");
  const startTraditional = Date.now();

  const traditionalResult = await evaluateSystem(
    "Tradicional",
    (userEmail, city) =>
      getHybridRecommendations(userEmail, null, city)
  );

  const endTraditional = Date.now();
  const traditionalTime = (endTraditional - startTraditional) / 1000;

  results.push({
    ...traditionalResult,
    timeSeconds: Number(traditionalTime.toFixed(2))
  });

  console.log(`⏱ Tradicional: ${traditionalTime.toFixed(2)} segundos`);

  // -------------------------------
  // IA
  // -------------------------------
  console.log("Evaluando sistema IA...");
  const startIA = Date.now();

  const iaResult = await evaluateSystem(
    "IA",
    (userEmail, city) =>
      getHybridAIRecommendations(userEmail, city)
  );

  const endIA = Date.now();
  const iaTime = (endIA - startIA) / 1000;

  results.push({
    ...iaResult,
    timeSeconds: Number(iaTime.toFixed(2))
  });

  console.log(`⏱ IA: ${iaTime.toFixed(2)} segundos`);

  // -------------------------------
  // RESULTADOS
  // -------------------------------
  console.table(results);
}

runExperiments();
