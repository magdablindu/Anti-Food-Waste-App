import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    createGroup,
    inviteToGroup,
    getMyGroups
} from "../controllers/groupsController.js";

const router = express.Router();

router.post("/create", authMiddleware, createGroup);
router.post("/:groupId/invite/:userId", authMiddleware, inviteToGroup);
router.get("/mine", authMiddleware, getMyGroups);

export default router;
