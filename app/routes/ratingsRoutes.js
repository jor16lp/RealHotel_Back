import express from "express";
import { getAll, getById, getByUser, getByHotel, getByEmailAndHotel, create, update, deleteById } from "../controllers/ratingsController.js";
const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.get("/user/:userEmail", getByUser);
router.get("/hotel/:hotelName", getByHotel);
router.get("/user/:userEmail/hotel/:hotelName", getByEmailAndHotel);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteById);

export default router;
