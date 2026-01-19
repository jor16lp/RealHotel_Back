import 'dotenv/config';

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initDB } from "./app/repositories/connection.js";

import hotelsRoutes from "./app/routes/hotelsRoutes.js";
import recommendationRoutes from "./app/routes/recommendationRoutes.js";
import usersRoutes from "./app/routes/usersRoutes.js";
import ratingsRoutes from "./app/routes/ratingsRoutes.js";
import aiRoutes from "./app/routes/aiRoutes.js";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Inicializar la base de datos y lanzar el servidor
(async () => {
  try {
    await initDB(); // 👈 conexión lista
    console.log("✅ Base de datos inicializada.");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error al iniciar la app:", err);
    process.exit(1);
  }
})();

// Rutas
app.use("/api/hotels", hotelsRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/ai", aiRoutes);
