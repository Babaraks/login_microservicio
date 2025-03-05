const express = require('express');
// const { login, register } = require('../controllers/authController');
const pool = require('../config/db');

const router = express.Router();

// Ruta para probar conexión con PostgreSQL
router.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');  // Consulta simple
        res.json({ message: 'Conexión exitosa', time: result.rows[0].now });
    } catch (error) {
        res.status(500).json({ message: 'Error al conectar a la base de datos', error: error.message });
    }
});

// Rutas de autenticación
// router.post('/login', login);
// router.post('/register', register);

module.exports = router;