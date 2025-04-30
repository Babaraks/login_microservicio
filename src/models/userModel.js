const pool = require('../config/db');

const getUserByEmail = async (email) => {
    const query = `SELECT * FROM public.usuarios WHERE correo = $1`;
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const getMangerById = async (email) => {
    const query = `SELECT p.*, s."ID" AS ID_punto FROM usuarios p JOIN punto_venta s ON p."ID" = s."ID_encargado" OR p."ID" = s."ID_repartidor" WHERE correo = $1`;
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const getCashierById = async (email) => {
    const query = `SELECT p.*, s."ID" AS ID_punto FROM usuarios p JOIN punto_cajero s ON p."ID" = s."ID_cajero" WHERE correo = $1`;
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0];
}

module.exports = {
    getUserByEmail,
    getMangerById,
    getCashierById
};