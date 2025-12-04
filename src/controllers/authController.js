import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ error: "Email deja utilizat" });

        const hash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, passwordHash: hash }
        });

        res.json({ message: "Cont creat", user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Eroare server" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: "Email sau parolă greșită" });

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(400).json({ error: "Email sau parolă greșită" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.json({ message: "Autentificare reușită", token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Eroare server" });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, role: true }
        });

        res.json(user);
    } catch {
        res.status(500).json({ error: "Eroare la preluarea profilului" });
    }
};
