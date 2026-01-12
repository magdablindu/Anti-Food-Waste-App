import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    createClaim,
    getMyClaims,
    getReceivedClaims,
    approveClaim,
    rejectClaim
} from "../controllers/claimsController.js";

const router = express.Router();

// Ruta pentru crearea unei cereri (necesită autentificare)
router.post("/:foodId", authMiddleware, createClaim);

// Ruta pentru vizualizarea cererilor proprii (necesită autentificare)
router.get("/mine", authMiddleware, getMyClaims);

// Ruta pentru vizualizarea cererilor primite (necesită autentificare)
router.get("/received", authMiddleware, getReceivedClaims);

// Ruta pentru aprobarea unei cereri (necesită autentificare)
router.put("/:id/approve", authMiddleware, approveClaim);

// Ruta pentru respingerea unei cereri (necesită autentificare)
router.put("/:id/reject", authMiddleware, rejectClaim);

export default router;
