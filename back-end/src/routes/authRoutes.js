import express from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Ruta pentru înregistrare utilizator
router.post("/register", register);

// Ruta pentru autentificare utilizator
router.post("/login", login);

// Ruta pentru obținerea profilului utilizatorului (necesită autentificare)
router.get("/me", authMiddleware, getProfile);

export default router;
