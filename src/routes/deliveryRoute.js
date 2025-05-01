const deliveryController = require('../controllers/deliveryController');
const express = require('express');
const router = express.Router();
const deliveryMode= [3];

router.get('/deliveries/:ID_almacen', deliveryController.getAllDeliveries);
router.put('/deliveries/updateStatus', deliveryController.updateStatus);
router.post('/deliveries/updateStock', deliveryController.updateStock);

module.exports = router;