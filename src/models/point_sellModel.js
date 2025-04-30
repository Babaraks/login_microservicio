const pool = require('../config/db.js');

const getPointSell = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM public.list_point_sell');
        return result.rows;
    } catch (error) {
        console.error('Error fetching point sell:', error);
        throw error;
    } finally {
        client.release();
    }
};

const getPointSellById = async (id) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM public.list_point_sell WHERE "id_punto_venta" = $1;', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching point sell by ID:', error);
        throw error;
    } finally {
        client.release();
    }
};

const createPointSell = async (pointSell) => {
    const client = await pool.connect();
    try {
        const { ID_encargado, ubicacion, ID_repartidor } = pointSell;
        const result = await client.query(
            'INSERT INTO public.punto_venta ("ID_encargado", "ubicacion", "ID_repartidor") VALUES ($1, $2, $3) RETURNING *;',
            [ID_encargado, ubicacion, ID_repartidor]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating point sell:', error);
        throw error;
    } finally {
        client.release();
    }
};

const updatePointSell = async (id, pointSell) => {
    const client = await pool.connect();
    try {
        const { ID_encargado, ubicacion, ID_repartidor } = pointSell;
        const result = await client.query(
            'UPDATE public.punto_venta SET "ID_encargado" = $1, "ubicacion" = $2, "ID_repartidor" = $3 WHERE "ID" = $4 RETURNING *;',
            [ID_encargado, ubicacion, ID_repartidor, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating point sell:', error);
        throw error;
    } finally {
        client.release();
    }
};

const deletePointSell = async (id) => {
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM public.punto_venta WHERE "ID" = $1 RETURNING *;', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting point sell:', error);
        throw error;
    } finally {
        client.release();
    }
};


module.exports = {
    getPointSell,
    getPointSellById,
    createPointSell,
    updatePointSell,
    deletePointSell
};