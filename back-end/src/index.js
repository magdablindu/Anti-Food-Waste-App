import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import claimsRoutes from "./routes/claimsRoutes.js";
import groupsRoutes from "./routes/groupsRoutes.js";


dotenv.config(); // Încarcă variabilele de mediu
const app = express();
const prisma = new PrismaClient();

// Configurare middleware
app.use(cors()); // Permite cereri din alte domenii
app.use(express.json()); // Permite parsing-ul body-ului ca JSON

// Rute API
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/claims", claimsRoutes);
app.use("/api/groups", groupsRoutes);

// Ruta de bază pentru verificare status server
app.get("/", (req, res) => {
  res.send("API Food Waste este pornit!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server pornit pe portul ${PORT}`));
