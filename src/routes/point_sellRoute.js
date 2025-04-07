const express = require('express');
const router = express.Router();
const pointSellController = require('../controllers/point_sellController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const adminrole = [0]

router.get('/',authMiddleware(adminrole),pointSellController.getPointSell);
router.get('/:id',authMiddleware(adminrole),pointSellController.getPointSellById);
router.post('/',authMiddleware(adminrole),pointSellController.createPointSell);
router.put('/:id',authMiddleware(adminrole),pointSellController.updatePointSell);
router.delete('/:id',authMiddleware(adminrole),pointSellController.deletePointSell);


module.exports = router;