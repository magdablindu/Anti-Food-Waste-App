import jwt from "jsonwebtoken";

/**
 * Middleware pentru autentificare.
 * Verifică prezența și validitatea token-ului JWT din header-ul Authorization.
 * Dacă token-ul este valid, adaugă informațiile utilizatorului în obiectul request.
 * @param {Object} req - Obiectul cererii.
 * @param {Object} res - Obiectul răspunsului.
 * @param {Function} next - Funcția pentru a trece la următorul middleware/handler.
 */
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
