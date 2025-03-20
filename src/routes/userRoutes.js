const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const adminRoles = [0];

router.get('/', authMiddleware(adminRoles), userController.getAllUsers);
router.get('/:id', authMiddleware(adminRoles), userController.getUserById);
router.post('/', authMiddleware(adminRoles), userController.createUser);
router.put('/:id', authMiddleware(adminRoles), userController.updateUser);
router.patch('/:id/password', authMiddleware(adminRoles), userController.updatePassword);
router.delete('/:id', authMiddleware(adminRoles), userController.deleteUser);

module.exports = router;