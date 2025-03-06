const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (allowedRoles) =>  (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET);
        if (!allowedRoles.includes(decoded.rol)) {
            return res.status(403).json({ message: 'No tienes permisos' });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'No autorizado' });
    }
}
module.exports = authMiddleware;