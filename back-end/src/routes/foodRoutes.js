import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    addFood,
    getMyFoods,
    getAvailableFoods,
    updateFood,
    deleteFood,
    updateFoodStatus,
    getExpiringFoods
} from "../controllers/foodController.js";

const router = express.Router();

// Ruta pentru adăugarea unui aliment (necesită autentificare)
router.post("/add", authMiddleware, addFood);

// Ruta pentru vizualizarea alimentelor proprii (necesită autentificare)
router.get("/mine", authMiddleware, getMyFoods);

// Ruta pentru vizualizarea alimentelor disponibile (necesită autentificare)
router.get("/available", authMiddleware, getAvailableFoods);

// Ruta pentru vizualizarea alimentelor care expiră curând (necesită autentificare)
router.get("/expiring", authMiddleware, getExpiringFoods);

// Ruta pentru actualizarea statusului unui aliment (necesită autentificare)
router.put("/:id/status", authMiddleware, updateFoodStatus);

// Ruta pentru actualizarea detaliilor unui aliment (necesită autentificare)
router.put("/:id", authMiddleware, updateFood);

// Ruta pentru ștergerea unui aliment (necesită autentificare)
router.delete("/:id", authMiddleware, deleteFood);

export default router;
