const pool = require('../config/db');

const getUserByEmail = async (email) => {
    const query = `SELECT * FROM public.usuario WHERE correo = $1`;
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0];
}

module.exports = {
    getUserByEmail,
};