import "dotenv/config";

import Groq from "groq-sdk";
let groq = null;
import OpenAI from "openai";
let openrouter = null;
// const openrouter = new OpenAI({ apiKey: process.env.OPENROUTER_API_KEY, baseURL: "https://openrouter.ai/api/v1", });

function getGroqClient() {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY no definida");
    }
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

function getOpenRouterClient() {
  if (!openrouter) {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY no definida");
    }
    openrouter = new OpenAI({ apiKey: process.env.OPENROUTER_API_KEY, baseURL: "https://openrouter.ai/api/v1", });
  }
  return openrouter;
}

import ratingsRepository from "../repositories/ratingsRepository.js";
import hotelsRepository from "../repositories/hotelsRepository.js";

// const ai = "groq";
const ai = "openrouter";

// ---------------------------
//  LLamada al LLM
// ---------------------------
async function callLLM(prompt, provider) {
  switch (provider) {
    case "groq":
      return callGroq(prompt);
    case "openrouter":
      return callOpenRouter(prompt);
    default:
      throw new Error("Proveedor LLM no soportado");
  }
}

// ---------------------------
//  LLamada al LLM (Groq)
// ---------------------------
async function callGroq(prompt) {
  const groqClient = getGroqClient();

  const completion = await groqClient.chat.completions.create({
    // model: "openai/gpt-oss-120b", 
    // model: "openai/gpt-oss-20b", 
    // model: "llama-3.3-70b-versatile", 
    model: "llama-3.1-8b-instant", 
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  return completion.choices[0].message.content;
}

// ---------------------------
//  LLamada al LLM (OpenRouter)
// ---------------------------
async function callOpenRouter(prompt) {
  const openRouterClient = getOpenRouterClient();

  const response = await openRouterClient.chat.completions.create({
    // model: "openai/gpt-4o-mini", 
    // model: "anthropic/claude-3-haiku", 
    // model: "meta-llama/llama-3-70b-instruct", 
    model: "meta-llama/llama-3.2-11b-vision-instruct", 
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  return response.choices[0].message.content;
}




// --------------------------------------------------
// 1) IA: Estimar puntuación desde comentario (1-5)
// --------------------------------------------------
export const estimateRatingFromComment = async (comment) => {
  const prompt = `
Eres un experto en análisis de sentimientos de reseñas de hoteles. Tu tarea es asignar un número del 1 al 5 basado en la calidad del comentario:
1 → Todo mal
2 → Negativo pero no catastrófico
3 → Neutral / Correcto
4 → Hay algún pero
5 → No hay cosas negativas

Evalúa ahora el comentario real:
"${comment}"

Responde exclusivamente con un número del 1 al 5. No tengas miedo de puntuar con 1 o 5, puedes ser extremo cuando se requiera.
  `;

  const response = await callLLM(prompt, ai);
  console.log(response)
  const rating = parseFloat(response);

  console.log(rating)

  if (isNaN(rating)) return null;
  return Math.min(5, Math.max(1, rating)); // clamp 1–5
};

// --------------------------------------------------
// 2) IA: Recomendaciones híbridas
// --------------------------------------------------
export const getHybridAIRecommendations = async (userEmail, city) => {
  // ---- Step A: Ratings (colaborativo)
  const ratings = await ratingsRepository.getAll();

  const matrix = {};
  for (const r of ratings) {
    if (!matrix[r.userEmail]) matrix[r.userEmail] = {};
    matrix[r.userEmail][r.hotelName] = r.rating;
  }

  const targetRatings = matrix[userEmail];
  // if (!targetRatings) return [];
  if (!targetRatings) {
    return hotelsRepository.getByCity(city).slice(0, 10);
  }

  // Cosine similarity
  function cos(a, b) {
    const common = Object.keys(a).filter((k) => k in b);
    if (common.length === 0) return 0;
    const dot = common.reduce((s, k) => s + a[k] * b[k], 0);
    const na = Math.sqrt(Object.values(a).reduce((s, x) => s + x * x, 0));
    const nb = Math.sqrt(Object.values(b).reduce((s, x) => s + x * x, 0));
    return dot / (na * nb);
  }

  // similitudes
  const sims = Object.entries(matrix)
    .filter(([email]) => email !== userEmail)
    .map(([email, ratings]) => ({
      email,
      similarity: cos(targetRatings, ratings)
    }))
    .sort((a, b) => b.similarity - a.similarity);

  const topUsers = sims.slice(0, 5);

  // Hotels from CF
  const recommended = {};
  for (const { email, similarity } of topUsers) {
    for (const [hotel, rating] of Object.entries(matrix[email])) {
      if (!(hotel in targetRatings)) {
        if (!recommended[hotel]) recommended[hotel] = 0;
        recommended[hotel] += rating * similarity;
      }
    }
  }

  // Obtener los nombres recomendados por CF (solo los nombres + score)
  const cfRaw = Object.entries(recommended)
    .map(([hotelName, score]) => ({ hotelName, score }))
    .sort((a, b) => b.score - a.score);

  // Obtener los datos completos de esos hoteles desde la BD
  const hotelsCFData = await hotelsRepository.getByNames(
    cfRaw.map(h => h.hotelName)
  );

  // Unir datos completos + score
  const topHotelsCF = hotelsCFData.map(hotel => {
    const item = cfRaw.find(x => x.hotelName === hotel.name);
    return { ...hotel, score: item?.score || 0 };
  });

  // Filtrar por ciudad
  const hotelsCF = topHotelsCF
    .filter(h => h.city.toLowerCase() === city.toLowerCase())
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

    console.log(hotelsCF)


  // ----------------------------------------------------------
  // Step B: Recomendación basada en contenido mediante IA
  // ----------------------------------------------------------
  const hotelsByCity = await hotelsRepository.getByCity(city);

  const userRatingsText = ratings
    .filter(r => r.userEmail === userEmail)
    .map(r => `${r.hotelName}: ${r.rating}/5`)
    .join("\n");

  const hotelsText = hotelsByCity
    .map(h => `${h.name} — ${h.city}, ${h.stars} estrellas, ${h.averagePrice}€`)
    .join("\n");

  const prompt = `
Tengo este historial de preferencias del usuario:

${userRatingsText}

Y esta lista completa de hoteles:

${hotelsText}

Basado únicamente en gustos, precio, características del hotel y perfil del usuario,
dame una lista de 10 hoteles recomendados.
Responde SOLO con los nombres separados por coma.
  `;

  // console.log(prompt)

  const aiResponse = await callLLM(prompt, ai);

  const aiHotels = aiResponse
    .split(",")
    .map((h) => h.trim())
    .filter((h) => h.length > 0);

  console.log("AI returned names:", aiHotels);

  // const aiHotelsNormalized = aiHotels.map(h => removeAccents(h.toLowerCase()));
  // const hotelsAI = (await hotelsRepository.getAll()).filter(h => aiHotelsNormalized.includes(removeAccents(h.name.toLowerCase())));

  const hotelsAI = await hotelsRepository.getByNames(aiHotels);

  // console.log(hotelsAI)

  // --------------------------------------------------
  // Step C: Mezcla híbrida CF + contenido IA
  // (60% CF — 40% IA)
  // --------------------------------------------------
  const final = [...hotelsCF, ...hotelsAI]
    .reduce((acc, h) => {
      acc[h.name] = h;
      return acc;
    }, {});

  console.log(Object.keys(final).length)
  const finalHotels = Object.values(final)
    .filter(h => h.city && h.city.toLowerCase() === city.toLowerCase())
    .slice(0, 10)

  // if (finalHotels.length === 0)
  //   return Object.values(final).slice(0, 10)
  
  return finalHotels;
};
