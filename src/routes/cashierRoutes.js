const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/perfil', authMiddleware(['cajero']), (req, res) => {
    res.json({ message: 'Bienvenido cajero', user: req.user });
}
);

module.exports = router;