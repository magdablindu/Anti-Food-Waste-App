import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addFood = async (req, res) => {
    try {
        const { name, category, quantity, expirationDate } = req.body;

        const food = await prisma.food.create({
            data: {
                name,
                category,
                quantity,
                expirationDate,
                ownerId: req.user.id,
                status: "DISPONIBIL"
            }
        });

        res.json(food);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Eroare la adăugarea alimentului" });
    }
};

export const getMyFoods = async (req, res) => {
    try {
        const foods = await prisma.food.findMany({
            where: { ownerId: req.user.id }
        });

        res.json(foods);
    } catch {
        res.status(500).json({ error: "Eroare la listarea alimentelor" });
    }
};

export const getAvailableFoods = async (req, res) => {
    try {
        const foods = await prisma.food.findMany({
            where: { status: "DISPONIBIL" }
        });

        res.json(foods);
    } catch {
        res.status(500).json({ error: "Eroare la listarea alimentelor disponibile" });
    }
};
