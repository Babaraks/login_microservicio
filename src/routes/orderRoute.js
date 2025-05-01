const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMidrdleware = require('../middlewares/authMiddleware');
const managermode = [1]
const cashierMode = [2]
const deliveryMode = [3]
const adminMode = [0]

// Rutas para crear un pedido
router.post('/createOrder', authMidrdleware(managermode), orderController.createOrder);
router.post('/createOrderDetails', authMidrdleware(managermode), orderController.createOrderDetails);
router.post('/createStatusDates', authMidrdleware(managermode), orderController.createStatusDates);
router.put('/updateStatus', authMidrdleware(managermode), orderController.updateStatus);
router.post('/minusStock', authMidrdleware(managermode), orderController.minusStock);
router.get('/getProductBrute', authMidrdleware(managermode), orderController.getProductBrute);
router.get('/getProductByPointSell/:ID_punto_venta', authMidrdleware(managermode), orderController.getProductByPointSell);
router.get('/getRequestsByManager/:ID_encargado', authMidrdleware(managermode), orderController.getRequestsByManager);
router.get('/getOrderByidManager/:ID_encargado', authMidrdleware(managermode), orderController.getOrderByidManager);
router.get('/getProductByPointSellByID/:ID_punto_venta', authMidrdleware(cashierMode), orderController.getProductByPointSellByID);

module.exports = router;