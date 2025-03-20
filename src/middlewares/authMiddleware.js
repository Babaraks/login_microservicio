const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (allowedRoles) => (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado' });
    }
    try {
        // Verifica el token y decodifica los datos
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET);
        // Verifica si el rol del usuario está permitido
        if (!allowedRoles.includes(decoded.rol)) {
            return res.status(403).json({ message: 'No tienes permisos' });
        }
        // Si todo es válido, agrega el usuario al request
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Token inválido' });
    }
}

module.exports = authMiddleware;
