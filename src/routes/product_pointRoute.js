const express = require('express');
const router = express.Router();
const productPointController = require('../controllers/product_pointController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const adminrole = [0]

router.get('/',authMiddleware(adminrole),productPointController.getProductPointPrincipal);
router.get('/:id',authMiddleware(adminrole),productPointController.getProductPoint);
router.post('/',authMiddleware(adminrole),productPointController.createProductPoint);
router.put('/:id',authMiddleware(adminrole),productPointController.updateProductPoint);
router.delete('/:id',authMiddleware(adminrole),productPointController.deleteProductPoint);

module.exports = router;