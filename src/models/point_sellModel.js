const pool = require('../config/db.js');

const getPointSell = async () => {
    const result = await pool.query('SELECT * FROM public.list_point_sell');
    return result.rows;
};

const getPointSellById = async (id) => {
    const result = await pool.query('SELECT * FROM public.list_point_sell WHERE "id_punto_venta" = $1;', [id]);
    return result.rows[0];
}

const createPointSell = async (pointSell) => {
    const { ID_encargado, ubicacion,ID_repartidor } = pointSell;
    const result = await pool.query('INSERT INTO public.punto_venta ("ID_encargado","ubicacion","ID_repartidor") VALUES ($1, $2, $3) RETURNING *;', [ID_encargado, ubicacion, ID_repartidor]);
    return result.rows[0];
}

const updatePointSell = async (id, pointSell) => {
    const { ID_encargado, ubicacion,ID_repartidor } = pointSell;
    const result = await pool.query('UPDATE public.punto_venta SET "ID_encargado" = $1, "ubicacion" = $2, "ID_repartidor" = $3 WHERE "ID" = $4 RETURNING *;', [ID_encargado, ubicacion, ID_repartidor, id]);
    return result.rows[0];
}

const deletePointSell = async (id) => {
    const result = await pool.query('DELETE FROM public.punto_venta WHERE "ID" = $1 RETURNING *;', [id]);
    return result.rows[0];
}

module.exports = {
    getPointSell,
    getPointSellById,
    createPointSell,
    updatePointSell,
    deletePointSell
};