import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import claimsRoutes from "./routes/claimsRoutes.js";
import groupsRoutes from "./routes/groupsRoutes.js";


dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/claims", claimsRoutes);
app.use("/api/groups", groupsRoutes);

app.get("/", (req, res) => {
  res.send("API Food Waste este pornit!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server pornit pe portul ${PORT}`));
