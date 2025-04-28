const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./src/config/ca.pem').toString(),
    },
});

pool.connect()
    .then(() => console.log('🟢 Conectado a PostgreSQL en Aiven'))
    .catch(err => console.error('🔴 Error de conexión:', err));

module.exports = pool;
