import express from "express";
import { getRecommendations } from "../controllers/recommendationController.js";
const router = express.Router();

// router.get("/:userEmail", getRecommendations);
router.post("/", getRecommendations);
// router.get("/evaluate", recommendationController.evaluateRecommender);

export default router;
