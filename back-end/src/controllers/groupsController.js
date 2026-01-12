import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Creează un grup nou.
 * @param {Object} req - Obiectul cererii (conține numele și tipul grupului).
 * @param {Object} res - Obiectul răspunsului.
 */
export const createGroup = async (req, res) => {
    try {
        const { name, type } = req.body;

        const group = await prisma.group.create({
            data: {
                name,
                type,
                createdById: req.user.id,
                members: {
                    create: {
                        userId: req.user.id
                    }
                }
            }
        });

        res.json(group);
    } catch (err) {
        res.status(500).json({ error: "Eroare la crearea grupului" });
    }
};

/**
 * Invită un utilizator într-un grup.
 * @param {Object} req - Obiectul cererii (conține ID-ul grupului și ID-ul utilizatorului invitat).
 * @param {Object} res - Obiectul răspunsului.
 */
export const inviteToGroup = async (req, res) => {
    try {
        const { groupId, userId } = req.params;

        const member = await prisma.groupMember.create({
            data: {
                groupId: Number(groupId),
                userId: Number(userId)
            }
        });

        res.json(member);
    } catch (err) {
        res.status(500).json({ error: "Eroare la invitarea în grup" });
    }
};

/**
 * Returnează grupurile din care face parte utilizatorul curent.
 * @param {Object} req - Obiectul cererii.
 * @param {Object} res - Obiectul răspunsului.
 */
export const getMyGroups = async (req, res) => {
    try {
        const groups = await prisma.groupMember.findMany({
            where: { userId: req.user.id },
            include: { group: true }
        });

        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: "Eroare la listarea grupurilor" });
    }
};
