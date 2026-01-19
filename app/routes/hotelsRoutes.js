import express from "express";
import { getAll, getByIdOrName, create, update, deleteByIdOrName } from "../controllers/hotelsController.js";
const router = express.Router();

router.get("/", getAll);
router.get("/:value", getByIdOrName);
router.post("/", create);
router.put("/:id", update);
router.delete("/:value", deleteByIdOrName);

export default router;
