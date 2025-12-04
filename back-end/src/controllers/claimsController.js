import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createClaim = async (req, res) => {
    try {
        const { foodId } = req.params;

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

export const getMyClaims = async (req, res) => {
    try {
        const claims = await prisma.claim.findMany({
            where: { requestedById: req.user.id },
            include: {
                food: true
            }
        });

        res.json(claims);
    } catch (err) {
        res.status(500).json({ error: "Eroare la listarea cererilor" });
    }
};
