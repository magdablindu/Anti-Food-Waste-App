import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    addFood,
    getMyFoods,
    getAvailableFoods
} from "../controllers/foodController.js";

const router = express.Router();

router.post("/add", authMiddleware, addFood);
router.get("/mine", authMiddleware, getMyFoods);
router.get("/available", authMiddleware, getAvailableFoods);

export default router;
