import express from "express";
import { estimateRating, getFinalRecommendations } from "../controllers/aiController.js";
const router = express.Router();

router.post("/ratingComment", estimateRating);
router.get("/:userEmail/:city", getFinalRecommendations);

export default router;
