const express = require('express');
const pool = require('../config/db');
const {login}= require('../controllers/authController');
require('dotenv').config();
const router = express.Router();

router.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');  // Consulta simple
        res.json({ message: 'Conexión exitosa', time: result.rows[0].now });
    } catch (error) {
        res.status(500).json({ message: 'Error al conectar a la base de datos', error: error.message });
    }
});
router.post('/login', login);


module.exports = router;