const pool = require('../config/db.js');

const getProductPointPrincipal = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM public.list_product_point WHERE "ID_punto_venta" = 1');
        return result.rows;
    } catch (error) {
        console.error('Error fetching principal product point:', error);
        throw error;
    } finally {
        client.release();
    }
};

const getProductPoint = async (id) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT p."nombre" AS nombre_producto, pvp."cantidad" FROM public.punto_venta_producto pvp INNER JOIN producto p ON pvp."ID_producto" = p."ID" WHERE pvp."ID_punto_venta" = 1 AND pvp."ID_producto" = $1;',
            [id]
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching product point:', error);
        throw error;
    } finally {
        client.release();
    }
};

const createProductPoint = async (productPoint) => {
    const client = await pool.connect();
    try {
        const { ID_producto, stock } = productPoint;
        const result = await client.query(`
            INSERT INTO public.punto_venta_producto ("ID_punto_venta", "ID_producto", "cantidad") 
            VALUES (1, $1, $2) 
            ON CONFLICT ("ID_punto_venta", "ID_producto") 
            DO UPDATE SET cantidad = punto_venta_producto.cantidad + EXCLUDED.cantidad
            RETURNING *;
        `, [ID_producto, stock]);

        return result.rows[0];
    } catch (error) {
        console.error('Error creating product point:', error);
        throw error;
    } finally {
        client.release();
    }
};

const updateProductPoint = async (id, productPoint) => {
    const client = await pool.connect();
    try {
        const { stock } = productPoint;
        const result = await client.query(
            'UPDATE public.punto_venta_producto SET "cantidad" = $1 WHERE "ID_punto_venta" = 1 AND "ID_producto" = $2 RETURNING *;',
            [stock, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating product point:', error);
        throw error;
    } finally {
        client.release();
    }
};

const deleteProductPoint = async (id) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'DELETE FROM public.punto_venta_producto WHERE "ID_punto_venta" = $1 AND "ID_producto" = $2 RETURNING *;',
            [id.ID_punto_venta, id.ID_producto]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting product point:', error);
        throw error;
    } finally {
        client.release();
    }
};


module.exports = {
    getProductPointPrincipal,
    getProductPoint,
    createProductPoint,
    updateProductPoint,
    deleteProductPoint
};
