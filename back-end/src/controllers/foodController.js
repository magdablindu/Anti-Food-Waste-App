import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Adaugă un aliment nou.
 * Creează un aliment cu detaliile furnizate și îl asociază utilizatorului curent.
 * @param {Object} req - Obiectul cererii (conține detaliile alimentului în body).
 * @param {Object} res - Obiectul răspunsului.
 */
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

/**
 * Returnează toate alimentele utilizatorului curent.
 * @param {Object} req - Obiectul cererii.
 * @param {Object} res - Obiectul răspunsului.
 */
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

/**
 * Returnează toate alimentele disponibile din sistem.
 * @param {Object} req - Obiectul cererii.
 * @param {Object} res - Obiectul răspunsului.
 */
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

/**
 * Actualizează detaliile unui aliment existent.
 * Verifică permisiunile și validitatea datelor înainte de actualizare.
 * @param {Object} req - Obiectul cererii (conține ID-ul alimentului în params și noile detalii în body).
 * @param {Object} res - Obiectul răspunsului.
 */
export const updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, quantity, expirationDate } = req.body;

        // Verifică dacă alimentul aparține utilizatorului
        const food = await prisma.food.findUnique({ where: { id: Number(id) } });
        if (!food) {
            return res.status(404).json({ error: "Alimentul nu a fost găsit" });
        }
        if (food.ownerId !== req.user.id) {
            return res.status(403).json({ error: "Nu ai permisiunea să modifici acest aliment" });
        }

        // Validare: data expirării nu poate fi în trecut
        if (expirationDate && new Date(expirationDate) < new Date()) {
            return res.status(400).json({ error: "Data expirării nu poate fi în trecut" });
        }

        const updatedFood = await prisma.food.update({
            where: { id: Number(id) },
            data: { name, category, quantity, expirationDate }
        });

        res.json(updatedFood);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Eroare la actualizarea alimentului" });
    }
};

/**
 * Șterge un aliment.
 * Verifică dacă utilizatorul are dreptul de a șterge alimentul.
 * @param {Object} req - Obiectul cererii (conține ID-ul alimentului în params).
 * @param {Object} res - Obiectul răspunsului.
 */
export const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifică dacă alimentul aparține utilizatorului
        const food = await prisma.food.findUnique({ where: { id: Number(id) } });
        if (!food) {
            return res.status(404).json({ error: "Alimentul nu a fost găsit" });
        }
        if (food.ownerId !== req.user.id) {
            return res.status(403).json({ error: "Nu ai permisiunea să ștergi acest aliment" });
        }

        await prisma.food.delete({ where: { id: Number(id) } });

        res.json({ message: "Aliment șters cu succes" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Eroare la ștergerea alimentului" });
    }
};

/**
 * Actualizează statusul unui aliment (ex: DISPONIBIL, REZERVAT, CONSUMAT).
 * Verifică dacă schimbarea statusului este permisă.
 * @param {Object} req - Obiectul cererii (conține ID-ul alimentului în params și noul status în body).
 * @param {Object} res - Obiectul răspunsului.
 */
export const updateFoodStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Verifică dacă alimentul aparține utilizatorului
        const food = await prisma.food.findUnique({ where: { id: Number(id) } });
        if (!food) {
            return res.status(404).json({ error: "Alimentul nu a fost găsit" });
        }
        if (food.ownerId !== req.user.id) {
            return res.status(403).json({ error: "Nu ai permisiunea să modifici acest aliment" });
        }

        // Validare: produse expirate nu pot fi marcate ca disponibile
        if (status === "DISPONIBIL" && new Date(food.expirationDate) < new Date()) {
            return res.status(400).json({ error: "Produsele expirate nu pot fi marcate ca disponibile" });
        }

        const updatedFood = await prisma.food.update({
            where: { id: Number(id) },
            data: { status }
        });

        res.json(updatedFood);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Eroare la actualizarea statusului" });
    }
};

/**
 * Returnează alimentele care expiră în următoarele 3 zile.
 * @param {Object} req - Obiectul cererii.
 * @param {Object} res - Obiectul răspunsului.
 */
export const getExpiringFoods = async (req, res) => {
    try {
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);

        const foods = await prisma.food.findMany({
            where: {
                ownerId: req.user.id,
                expirationDate: {
                    gte: today,
                    lte: threeDaysFromNow
                },
                status: {
                    not: "CONSUMAT"
                }
            },
            orderBy: {
                expirationDate: 'asc'
            }
        });

        res.json(foods);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Eroare la listarea alimentelor care expiră" });
    }
};
