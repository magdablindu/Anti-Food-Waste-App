import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createGroup = async (req, res) => {
    try {
        const { name, type } = req.body;

        const group = await prisma.group.create({
            data: {
                name,
                type,
                createdById: req.user.id
            }
        });

        res.json(group);
    } catch (err) {
        res.status(500).json({ error: "Eroare la crearea grupului" });
    }
};

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
