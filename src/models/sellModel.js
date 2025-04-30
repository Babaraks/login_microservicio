const pool = require('../config/db.js');

const createSell = async (sell) => {
    const client = await pool.connect();
    try {
        const { ID_cajero, fecha } = sell;
        const result = await client.query(
            'INSERT INTO public.venta ("ID_cajero","fecha" ) VALUES ($1, $2) RETURNING *', 
            [ID_cajero, fecha]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error al crear la venta:', error);
        throw error;
    } finally {
        client.release();
    }
};

const createSellProducts = async (sellProducts) => {
    const client = await pool.connect();
    try {
        const values = [];
        const placeholders = sellProducts.map((item, index) => {
            const i = index * 3;
            values.push(item.ID_venta, item.ID_producto, item.cantidad);
            return `($${i + 1}, $${i + 2}, $${i + 3})`;
        }).join(', ');

        const query = `INSERT INTO venta_producto ("ID_venta", "ID_producto", "cantidad") VALUES ${placeholders} RETURNING *`;
        const result = await client.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error creating sell products:', error);
        throw error;
    } finally {
        client.release();
    }
};

const minusStock = async (sellProducts) => {
    const client = await pool.connect();
    try {
        // Validación de existencia y stock suficiente
        const condiciones = sellProducts.map((p, i) =>
            `("ID_punto_venta" = ${p.ID_punto_venta} AND "ID_producto" = ${p.ID_producto})`
        ).join(' OR ');

        const { rows: stocks } = await client.query(
            `SELECT "ID_punto_venta", "ID_producto", "cantidad"
             FROM punto_venta_producto
             WHERE ${condiciones}`
        );

        const stockMap = new Map();
        stocks.forEach(p => {
            stockMap.set(`${p.ID_punto_venta}_${p.ID_producto}`, p.cantidad);
        });

        for (const item of sellProducts) {
            const key = `${item.ID_punto_venta}_${item.ID_producto}`;
            const actual = stockMap.get(key);

            if (actual === undefined) {
                throw new Error(`Producto ID ${item.ID_producto} no existe en punto de venta ID ${item.ID_punto_venta}`);
            }

            if (actual < item.cantidad) {
                throw new Error(`Stock insuficiente para producto ID ${item.ID_producto} en punto de venta ID ${item.ID_punto_venta}. Actual: ${actual}, requerido: ${item.cantidad}`);
            }
        }

        // Actualización
        await client.query('BEGIN');

        const updatePromises = sellProducts.map(p => {
            return client.query(`
                UPDATE punto_venta_producto
                SET "cantidad" = "cantidad" - $1
                WHERE "ID_punto_venta" = $2 AND "ID_producto" = $3
            `, [p.cantidad, p.ID_punto_venta, p.ID_producto]);
        });

        await Promise.all(updatePromises);
        await client.query('COMMIT');

        return { message: 'Stock actualizado correctamente en punto de venta' };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error actualizando stock por punto de venta:', error);
        throw error;
    } finally {
        client.release();
    }
};

const getAllpointproducts = async (id) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM public.list_product_point WHERE ID_punto_venta=$1', [id]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching all products:', error);
        throw error;
    } finally {
        client.release();
    }
};

const getAllSells = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM public.list_sell');
        return result.rows;
    } catch (error) {
        console.error('Error fetching all sells:', error);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    createSell,
    createSellProducts,
    minusStock,
    getAllpointproducts
};  