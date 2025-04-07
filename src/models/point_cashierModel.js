const pool = require('../config/db.js');

const getPointcashier = async () => {
    try {
        const result = await pool.query('SELECT * FROM public.punto_cajero;');
        return result.rows; 
    }
    catch (error) {
        console.error('Error al obtener los puntos de venta:', error);
        throw error; 
    }   
}

const getPointcashierById_cajero = async (id) => {
    try {
        const result = await pool.query('SELECT * FROM public.punto_cajero WHERE "ID_cajero" = $1;', [id]);
        return result.rows[0]; 
    } catch (error) {
        console.error('Error al obtener el punto de venta:', error);
        throw error; 
    }
}

const createPointcashier = async (pointcashier) => {
    try {
        const { ID_cajero, ID_punto_venta } = pointcashier;
        const result = await pool.query('INSERT INTO public.punto_cajero ("ID_cajero", "ID_punto_venta") VALUES ($1, $2) RETURNING *;', [ID_cajero, ID_punto_venta]);
        return result.rows[0]; 
    } catch (error) {
        console.error('Error al crear el punto de venta:', error);
        throw error; 
    }
}

const updatePointcashier = async (id, pointcashier) => {
    try {
        const { ID_punto_venta,ID_cajero } = pointcashier;
        const result = await pool.query('UPDATE public.punto_cajero SET "ID_punto_venta" = $1,"ID_cajero" = $2 WHERE "ID" = $3 RETURNING *;', [ID_punto_venta, ID_cajero,id]);
        return result.rows[0]; 
    } catch (error) {
        console.error('Error al actualizar el punto de venta:', error);
        throw error; 
    }
}

const deletePointcashier = async (id) => {
    try {
        const result = await pool.query('DELETE FROM public.punto_cajero WHERE "ID_cajero" = $1 RETURNING *;', [id]);
        return result.rows[0]; 
    } catch (error) {
        console.error('Error al eliminar el punto de venta:', error);
        throw error; 
    }
}

module.exports = {
    getPointcashier,
    getPointcashierById_cajero,
    createPointcashier,
    updatePointcashier,
    deletePointcashier
};

