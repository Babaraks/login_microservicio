const pool = require('../config/db.js');

const getPointcashier = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM public.punto_cajero;');
        return result.rows;
    } catch (error) {
        console.error('Error al obtener los puntos de venta:', error);
        throw error;
    } finally {
        client.release();
    }
};

const getPointcashierById_cajero = async (id) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM public.punto_cajero WHERE "ID_cajero" = $1;', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error al obtener el punto de venta:', error);
        throw error;
    } finally {
        client.release();
    }
};

const createPointcashier = async (pointcashier) => {
    const client = await pool.connect();
    try {
        const { ID_cajero, ID_punto_venta } = pointcashier;
        const result = await client.query(
            'INSERT INTO public.punto_cajero ("ID_cajero", "ID_punto_venta") VALUES ($1, $2) RETURNING *;',
            [ID_cajero, ID_punto_venta]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error al crear el punto de venta:', error);
        throw error;
    } finally {
        client.release();
    }
};

const updatePointcashier = async (id, pointcashier) => {
    const client = await pool.connect();
    try {
        const { ID_punto_venta, ID_cajero } = pointcashier;
        const result = await client.query(
            'UPDATE public.punto_cajero SET "ID_punto_venta" = $1, "ID_cajero" = $2 WHERE "ID" = $3 RETURNING *;',
            [ID_punto_venta, ID_cajero, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error al actualizar el punto de venta:', error);
        throw error;
    } finally {
        client.release();
    }
};

const deletePointcashier = async (id) => {
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM public.punto_cajero WHERE "ID_cajero" = $1 RETURNING *;', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error al eliminar el punto de venta:', error);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    getPointcashier,
    getPointcashierById_cajero,
    createPointcashier,
    updatePointcashier,
    deletePointcashier
};

