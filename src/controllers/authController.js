const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserByEmail } = require('../models/userModel');
require('dotenv').config();

const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const userType = user.rol;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, rol: userType, nombre: user.nombre, id_punto_venta: user.id_punto },
            process.env.SECRET,
            { expiresIn: 86400 }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                rol: userType,
                nombre: user.nombre,
                id_punto_venta: user.id_punto
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
}

module.exports = { login };
