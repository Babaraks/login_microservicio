const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserByEmail } = require('../models/userModel');
const { getCashierByEmail } = require('../models/cashierModel');
require('dotenv').config();

const login = async (req, res) => {
    const { email, password} = req.body;
    try {
        let user;
        let userType = 'cajero';

        user = await getUserByEmail(email);
        if (user) {
            userType = user.rol;
        }else{
            user = await getCashierByEmail(email);
        }
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        const isMarch = await bcrypt.compare(password, user.password);
        if (!isMarch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        const token = jwt.sign({ id: user.id, email: user.email, rol: userType }, process.env.SECRET, {
            expiresIn: 86400,
        });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
}

module.exports = { login };