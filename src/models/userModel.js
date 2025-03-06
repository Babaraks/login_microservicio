const pool = require('../config/db');

const getUserByEmail = async (email) => {
    const query = `SELECT * FROM usuarios WHERE correo = $1`;
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0];
}

module.exports = {
    getUserByEmail,
};