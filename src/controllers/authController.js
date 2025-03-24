const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserByEmail } = require('../models/userModel');
require('dotenv').config();

const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        let user;
        let userType = null; // Cambiamos el tipo por defecto a `null`

        user = await getUserByEmail(email);
        if (user) {
            userType = user.rol; // Si es un usuario normal, asignamos su rol
        } 

        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generamos el token con la información del usuario
        const token = jwt.sign(
            { id: user.id, email: user.email, rol: userType },
            process.env.SECRET,
            { expiresIn: 86400 }
        );

        // Ahora devolvemos el token junto con los datos del usuario
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                rol: userType, // Incluimos el rol en la respuesta
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
}

module.exports = { login };
