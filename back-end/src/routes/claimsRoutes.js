import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    createClaim,
    getMyClaims
} from "../controllers/claimsController.js";

const router = express.Router();

router.post("/:foodId", authMiddleware, createClaim);
router.get("/mine", authMiddleware, getMyClaims);

export default router;
