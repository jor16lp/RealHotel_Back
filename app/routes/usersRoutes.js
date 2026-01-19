import express from "express";
import { getAll, getById, getByEmail, create, update, deleteByIdOrEmail, login } from "../controllers/usersController.js";
const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.get("/email/:email", getByEmail);
router.post("/", create);
router.post("/login", login);
router.put("/:id", update);
router.delete("/:value", deleteByIdOrEmail);

export default router;
