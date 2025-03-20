const userModels = require('../models/userModel');

const getAllUsers = async (req, res) => {
    try{
        const users = await userModels.getAllUsers();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error});
    }
}

const getUserById = async (req, res) => {
    try{
        const id = req.params.id;
        const user = await userModels.getUserById(id);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario', error});
    }
}
const createUser = async (req, res) => {
    try {
        const user = await userModels.createUser(req.body);
        res.status(201).json(user);
        }
    catch (error) {
        res.status(500).json({ message: 'Error al crear usuario', error});
    }
}
const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModels.updateUser(id, req.body);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error});
    }
}
const updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        await userModel.updatePassword(req.params.id, newPassword);
        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar contraseña', error });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        await userModels.deleteUser(id);
        res.json({ message: 'Usuario eliminado' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario', error});
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    updatePassword,
    deleteUser,
};