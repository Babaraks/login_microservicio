const pool = require('../config/db.js');

const getProductPointPrincipal = async () => {
    const result = await pool.query('SELECT * FROM public.list_product_point WHERE "ID_punto_venta" =1');
    return result.rows;
}

const getProductPoint = async (id) => {
    const result = await pool.query('SELECT p."nombre" AS nombre_producto, pvp."cantidad" FROM public.punto_venta_producto pvp INNER JOIN producto p ON pvp."ID_producto" = p."ID" WHERE pvp."ID_punto_venta" = 1 AND pvp."ID_producto" = $1;', [id]);
    return result.rows;
}

const createProductPoint = async (productPoint) => {
    const { ID_producto, stock } = productPoint;
    const result = await pool.query(`
        INSERT INTO public.punto_venta_producto ("ID_punto_venta", "ID_producto", "cantidad") 
        VALUES (1, $1, $2) 
        ON CONFLICT ("ID_punto_venta", "ID_producto") 
        DO UPDATE SET cantidad = punto_venta_producto.cantidad + EXCLUDED.cantidad
        RETURNING *;
    `, [ID_producto, stock]);

    return result.rows[0];
};


const updateProductPoint = async ( id,productPoint) => {
    const {stock } = productPoint;
    const result = await pool.query('UPDATE public.punto_venta_producto SET "stock" = $1 WHERE "ID_punto_venta" = 1 AND "ID_producto" = $2 RETURNING *;', [stock,id]);
    return result.rows[0];
}

const deleteProductPoint = async (id) => {
    const result = await pool.query('DELETE FROM public.punto_venta_producto WHERE "ID_punto_venta" = $1 AND "ID_producto" = $2 RETURNING *;', [id.ID_punto_venta, id.ID_producto]);
    return result.rows[0];
}

module.exports = {
    getProductPointPrincipal,
    getProductPoint,
    createProductPoint,
    updateProductPoint,
    deleteProductPoint
};
