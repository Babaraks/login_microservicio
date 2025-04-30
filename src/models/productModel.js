const pool = require('../config/db');

const getAllProducts = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM public.producto ORDER BY "ID" ASC');
        return result.rows;
    } finally {
        client.release();
    }
};

const getProductById = async (id) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT * FROM public.producto WHERE "ID" = $1', 
            [id]
        );
        return result.rows;
    } finally {
        client.release();
    }
};

const createProduct = async (product) => {
    const { nombre, precio, tipo } = product;
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO producto ("nombre", "tipo", "precio") VALUES ($1, $2, $3) RETURNING *',
            [nombre, tipo, precio]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
};

const updateProduct = async (id, nombre, tipo, precio) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'UPDATE producto SET "nombre" = $1, "tipo" = $2, "precio" = $3 WHERE ID = $4 RETURNING *',
            [nombre, tipo, precio, id]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
};

const deleteProduct = async (id) => {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM producto WHERE "ID" = $1', [id]);
        return { message: 'Producto eliminado' };
    } finally {
        client.release();
    }
};
module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};