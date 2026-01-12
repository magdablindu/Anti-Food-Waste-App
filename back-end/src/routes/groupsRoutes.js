import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    createGroup,
    inviteToGroup,
    getMyGroups
} from "../controllers/groupsController.js";

const router = express.Router();

// Ruta pentru crearea unui grup (necesită autentificare)
router.post("/create", authMiddleware, createGroup);

// Ruta pentru invitarea unui utilizator în grup (necesită autentificare)
router.post("/:groupId/invite/:userId", authMiddleware, inviteToGroup);

// Ruta pentru vizualizarea grupurilor proprii (necesită autentificare)
router.get("/mine", authMiddleware, getMyGroups);

export default router;
