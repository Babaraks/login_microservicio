const express = require('express');
const router = express.Router();
const sellController = require('../controllers/sellController');
const authMiddleware = require('../middlewares/authMiddleware');
const cashiermode=[2]
const adminmode=[1]

router.post('/sell', authMiddleware(cashiermode), sellController.createSell);
router.post('/sell/products', authMiddleware(cashiermode), sellController.createSellProducts);
router.post('/sell/stock', authMiddleware(cashiermode), sellController.minusStock);
// router.get('/sell', authMiddleware(adminmode), sellController.getAllSells);
// router.get('/sell/:id', authMiddleware(adminmode), sellController.getSellById);

module.exports = router;