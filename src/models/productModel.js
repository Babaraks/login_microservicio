const pool = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const saltRounds = 12;

const getAllProducts = async () => {
    const result = await pool.query('SELECT * FROM public.producto ORDER BY "ID" ASC');
    return result.rows;
}
const getProductById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM public.producto WHERE "ID" = $1', 
        [id]
    );
    return result.rows;
}

const createProduct = async (product) => {
    const { nombre, precio, tipo } = product;
    const result = await pool.query(
        'INSERT INTO producto ("nombre", "tipo", "precio") VALUES ($1, $2, $3) RETURNING *',
        [nombre, tipo,precio ]
    );
    return result.rows[0];
}

const updateProduct = async (id, nombre, tipo, precio) => {
    const result = await pool.query(
        'UPDATE producto SET "nombre" = $1, "tipo" = $2, "precio" = $3 WHERE ID = $4 RETURNING *',
        [nombre, tipo, precio, id]
    );
    return result.rows[0];
}
const deleteProduct = async (id) => {
    await pool.query('DELETE FROM producto WHERE "ID" = $1', [id]);
    return { message: 'Producto eliminado' };
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};