const express = require('express');
const router = express.Router();
const pointCashierController = require('../controllers/point_cashierController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const adminrole = [0]

router.get('/',authMiddleware(adminrole),pointCashierController.getPointcashier);
router.get('/:id',authMiddleware(adminrole),pointCashierController.getPointcashierById_cajero);
router.post('/',authMiddleware(adminrole),pointCashierController.createPointcashier);
router.put('/:id',authMiddleware(adminrole),pointCashierController.updatePointcashier);
router.delete('/:id',authMiddleware(adminrole),pointCashierController.deletePointcashier);

module.exports = router;