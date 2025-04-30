const pool = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 12;

const getAllUsers = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT "ID", "nombre", "correo", "telefono", "rol" FROM public.usuarios ORDER BY "ID" ASC');
        return result.rows;
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        throw error;
    } finally {
        client.release();
    }
};

const getUserById = async (id) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT "ID", "nombre", "correo", "telefono", "rol" FROM public.usuarios WHERE "ID" = $1', 
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error al obtener el usuario por ID:', error);
        throw error;
    } finally {
        client.release();
    }
};

const createUser = async (user) => {
    const { nombre, correo, telefono, password, rol } = user;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO usuarios ("nombre", "correo", "telefono", "password", "rol") VALUES ($1, $2, $3, $4, $5) RETURNING "ID", "nombre", "correo", "telefono", "rol"',
            [nombre, correo, telefono, hashedPassword, rol]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    } finally {
        client.release();
    }
};

const updateUser = async (id, nombre, correo, telefono, rol) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'UPDATE usuarios SET "nombre" = $1, "correo" = $2, "telefono" = $3, "rol" = $4 WHERE ID = $5 RETURNING "ID", "nombre", "correo", "telefono", "rol"',
            [nombre, correo, telefono, rol, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Cambiar la contraseña con `$2b$12$`
const updatePassword = async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const client = await pool.connect();
    try {
        await client.query('UPDATE usuarios SET "password" = $1 WHERE "ID" = $2', [hashedPassword, id]);
        return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        throw error;
    } finally {
        client.release();
    }
};

const deleteUser = async (id) => {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM usuarios WHERE "ID" = $1', [id]);
        return { message: 'Usuario eliminado' };
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw error;
    } finally {
        client.release();
    }
};


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    updatePassword,
    deleteUser,
};