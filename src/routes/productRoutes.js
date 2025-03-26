const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const adminrole =[0]

router.get('/',authMiddleware(adminrole), productController.getAllProducts);
router.get('/:id',authMiddleware(adminrole), productController.getProductById);
router.post('/', authMiddleware(adminrole), productController.createProduct);
router.put('/:id', authMiddleware(adminrole), productController.updateProduct);
router.delete('/:id', authMiddleware(adminrole), productController.deleteProduct);

module.exports = router;