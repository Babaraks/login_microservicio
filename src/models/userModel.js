const pool = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const saltRounds = 12;

const getAllUsers = async () => {
    const result = await pool.query('SELECT "ID", "nombre", "correo", "telefono", "rol" FROM public.usuarios ORDER BY "ID" ASC');
    return result.rows;
};
const getUserById = async (id) => {
    const result = await pool.query(
        'SELECT "ID", "nombre", "correo", "telefono", "rol" FROM public.usuarios WHERE "ID" = $1', 
        [id]
    );
    return result.rows;
}

const createUser = async (user) => {
    const { nombre, correo, telefono, password, rol } = user;
    const hashedPassword = await bcrypt.hash(password, saltRounds); 
    const result = await pool.query(
        'INSERT INTO usuarios ("nombre", "correo", "telefono", "password", "rol") VALUES ($1, $2, $3, $4, $5) RETURNING "ID", "nombre", "correo", "telefono", "rol"',
        [nombre, correo, telefono, hashedPassword, rol]
    );
    return result.rows[0];
}

const updateUser = async (id, nombre, correo, telefono, rol) => {
    const result = await pool.query(
        'UPDATE usuarios SET "nombre" = $1, "correo" = $2, "telefono" = $3, "rol" = $4 WHERE ID = $5 RETURNING "ID", "nombre", "correo", "telefono", "rol"',
        [nombre, correo, telefono, rol, id]
    );
    return result.rows[0];
};

// Cambiar la contraseña con `$2b$12$`
const updatePassword = async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await pool.query('UPDATE usuarios SET "password" = $1 WHERE "ID" = $2', [hashedPassword, id]);
    return { message: 'Contraseña actualizada correctamente' };
};

const deleteUser = async (id) => {
    await pool.query('DELETE FROM usuarios WHERE "ID" = $1', [id]);
    return { message: 'Usuario eliminado' };
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    updatePassword,
    deleteUser,
};