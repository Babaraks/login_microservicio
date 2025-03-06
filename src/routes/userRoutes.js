const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/perfil', authMiddleware(['0', '1']), (req, res) => {
    res.json({ message: 'Bienvenido usuario web/móvil', user: req.user });
}
);

module.exports = router;