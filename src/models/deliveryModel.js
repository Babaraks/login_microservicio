const pool = require('../config/db');

const getAllDeliveries = async (ID_almacen) => {
    const status = 'Enviado';
    const client = await pool.connect();
    try {
        const query = `SELECT * FROM public.repartidor WHERE "ID_almacen" = $1 AND "status" = $2`;
        const result = await client.query(query, [ID_almacen, status]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching deliveries:', error);
        throw error;
    } finally {
        client.release();
    }
};

const updateStatus = async (statusUpdates) => {
    if (!Array.isArray(statusUpdates) || statusUpdates.length === 0) {
        throw new Error('Se necesita un arreglo de actualizaciones.');
    }

    const client = await pool.connect();
    try {
        // Crear arrays para los IDs y los nuevos estados
        const ids = [];
        const cases = [];

        statusUpdates.forEach((item) => {
            ids.push(item.ID);
            cases.push(`WHEN ${item.ID} THEN '${item.status}'`);
        });

        const query = `
            UPDATE public.pedido_producto
            SET "status" = CASE "ID"
                ${cases.join('\n')}
            END
            WHERE "ID" = ANY($1::int[])
            RETURNING *;
        `;

        const result = await client.query(query, [ids]);
        return result.rows;
    } catch (error) {
        console.error('Error updating status:', error);
        throw error;
    } finally {
        client.release();
    }
};
const plusStock = async (OrderProducts) => {
    const client = await pool.connect();

    try {
        // Validación de existencia de productos en la tabla
        const condiciones = OrderProducts.map((p) =>
            `("ID_punto_venta" = ${p.ID_punto_venta} AND "ID_producto" = ${p.ID_producto})`
        ).join(' OR ');

        const { rows: stocks } = await client.query(
            `SELECT "ID_punto_venta", "ID_producto", "cantidad"
             FROM punto_venta_producto
             WHERE ${condiciones}`
        );

        const stockMap = new Map();
        stocks.forEach((p) => {
            stockMap.set(`${p.ID_punto_venta}_${p.ID_producto}`, p.cantidad);
        });

        // Inicia la transacción
        await client.query('BEGIN');

        const updatePromises = OrderProducts.map((p) => {
            const key = `${p.ID_punto_venta}_${p.ID_producto}`;
            const actualStock = stockMap.get(key);

            if (actualStock !== undefined) {
                // Si existe, actualizar la cantidad
                return client.query(
                    `
                    UPDATE punto_venta_producto
                    SET "cantidad" = "cantidad" + $1
                    WHERE "ID_punto_venta" = $2 AND "ID_producto" = $3
                    `,
                    [p.cantidad, p.ID_punto_venta, p.ID_producto]
                );
            } else {
                // Si no existe, insertar nuevo producto
                return client.query(
                    `
                    INSERT INTO punto_venta_producto ("ID_punto_venta", "ID_producto", "cantidad")
                    VALUES ($1, $2, $3)
                    `,
                    [p.ID_punto_venta, p.ID_producto, p.cantidad]
                );
            }
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



module.exports = {
    getAllDeliveries,
    updateStatus,
    plusStock
};