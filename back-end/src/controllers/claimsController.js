import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Creează o cerere pentru un aliment.
 * Verifică disponibilitatea alimentului și dacă utilizatorul a mai făcut o cerere.
 * @param {Object} req - Obiectul cererii (conține ID-ul alimentului în params).
 * @param {Object} res - Obiectul răspunsului.
 */
export const createClaim = async (req, res) => {
    try {
        const { foodId } = req.params;

        // Verifică dacă alimentul există
        const food = await prisma.food.findUnique({ where: { id: Number(foodId) } });
        if (!food) {
            return res.status(404).json({ error: "Alimentul nu a fost găsit" });
        }

        // Verifică dacă utilizatorul încearcă să revendice propriul aliment
        if (food.ownerId === req.user.id) {
            return res.status(400).json({ error: "Nu poți revendica propriul aliment" });
        }

        // Verifică dacă alimentul este disponibil
        if (food.status !== "DISPONIBIL") {
            return res.status(400).json({ error: "Acest aliment nu mai este disponibil" });
        }

        // Verifică dacă utilizatorul a mai făcut o cerere pentru acest aliment
        const existingClaim = await prisma.claim.findFirst({
            where: {
                foodId: Number(foodId),
                requestedById: req.user.id
            }
        });

        if (existingClaim) {
            return res.status(400).json({ error: "Ai făcut deja o cerere pentru acest aliment" });
        }

        const claim = await prisma.claim.create({
            data: {
                foodId: Number(foodId),
                requestedById: req.user.id,
                status: "IN ASTEPTARE"
            }
        });

        res.json(claim);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Eroare la crearea cererii" });
    }
};

/**
 * Returnează toate cererile făcute de utilizatorul curent.
 * @param {Object} req - Obiectul cererii.
 * @param {Object} res - Obiectul răspunsului.
 */
export const getMyClaims = async (req, res) => {
    try {
        const claims = await prisma.claim.findMany({
            where: { requestedById: req.user.id },
            include: {
                food: true
            },
            orderBy: {
                requestedAt: 'desc'
            }
        });

        res.json(claims);
    } catch (err) {
        res.status(500).json({ error: "Eroare la listarea cererilor" });
    }
};

/**
 * Returnează cererile primite pentru alimentele deținute de utilizator.
 * @param {Object} req - Obiectul cererii.
 * @param {Object} res - Obiectul răspunsului.
 */
export const getReceivedClaims = async (req, res) => {
    try {
        const claims = await prisma.claim.findMany({
            where: {
                food: {
                    ownerId: req.user.id
                }
            },
            include: {
                food: true,
                requestedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                requestedAt: 'desc'
            }
        });

        res.json(claims);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Eroare la listarea cererilor primite" });
    }
};

/**
 * Aprobă o cerere pentru un aliment.
 * Marchează cererea ca fiind aprobată și alimentul ca fiind rezervat.
 * @param {Object} req - Obiectul cererii (conține ID-ul cererii în params).
 * @param {Object} res - Obiectul răspunsului.
 */
export const approveClaim = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifică dacă claim-ul există
        const claim = await prisma.claim.findUnique({
            where: { id: Number(id) },
            include: { food: true }
        });

        if (!claim) {
            return res.status(404).json({ error: "Cererea nu a fost găsită" });
        }

        // Verifică dacă utilizatorul este proprietarul alimentului
        if (claim.food.ownerId !== req.user.id) {
            return res.status(403).json({ error: "Nu ai permisiunea să aprobi această cerere" });
        }

        // Actualizează claim-ul și statusul alimentului
        const updatedClaim = await prisma.claim.update({
            where: { id: Number(id) },
            data: { status: "APROBAT" }
        });

        await prisma.food.update({
            where: { id: claim.foodId },
            data: { status: "REZERVAT" }
        });

        res.json(updatedClaim);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Eroare la aprobarea cererii" });
    }
};

/**
 * Respinge o cerere pentru un aliment.
 * Marchează cererea ca fiind respinsă.
 * @param {Object} req - Obiectul cererii (conține ID-ul cererii în params).
 * @param {Object} res - Obiectul răspunsului.
 */
export const rejectClaim = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifică dacă claim-ul există
        const claim = await prisma.claim.findUnique({
            where: { id: Number(id) },
            include: { food: true }
        });

        if (!claim) {
            return res.status(404).json({ error: "Cererea nu a fost găsită" });
        }

        // Verifică dacă utilizatorul este proprietarul alimentului
        if (claim.food.ownerId !== req.user.id) {
            return res.status(403).json({ error: "Nu ai permisiunea să respingi această cerere" });
        }

        const updatedClaim = await prisma.claim.update({
            where: { id: Number(id) },
            data: { status: "RESPINS" }
        });

        res.json(updatedClaim);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Eroare la respingerea cererii" });
    }
};
