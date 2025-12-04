import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Acces refuzat. Lipsă token." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token invalid sau expirat." });
    }
}
