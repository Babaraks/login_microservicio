const pool = require('../config/db');

const createOrder = async (order) => {
    const client = await pool.connect();
    try {
        const {ID_punto_venta, ID_encargado} = order;
        const fecha = new Date();
        const result = await client.query(
            'INSERT INTO public.pedido("ID_punto_venta","ID_encargado", "fecha") VALUES ($1, $2, $3) RETURNING *',
            [ID_punto_venta, ID_encargado, fecha]
        );
        return result.rows[0]; // retorna el pedido creado
    } finally {
        client.release();
    }
}

const createOrderDetails = async (orderDetails) => {
    if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
        throw new Error('Se necesita un arreglo con los detalles del pedido.');
    }

    const client = await pool.connect();
    try {
        const values = [];
        const placeholders = orderDetails.map((detail, index) => {
            const baseIndex = index * 5;
            values.push(
                detail.ID_pedido,
                detail.ID_producto,
                detail.cantidad,
                detail.ID_almacen,
                detail.status === undefined ? 'Pendiente' : detail.status // Asignar 'Pendiente' si no se proporciona status
            );
            return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`;
        }).join(', ');

        const query = `
            INSERT INTO public.pedido_producto("ID_pedido", "ID_producto", "cantidad", "ID_almacen", "status")
            VALUES ${placeholders}
            RETURNING *
        `;

        const result = await client.query(query, values);
        return result.rows; // retorna todos los detalles insertados
    } finally {
        client.release();
    }
};

const createStatusDates = async (statusDates) => {
    if (!Array.isArray(statusDates) || statusDates.length === 0) {
        throw new Error('Se necesita un arreglo con datos de status_fecha');
    }

    const client = await pool.connect();
    try {
        const values = [];
        const placeholders = statusDates.map((item, index) => {
            const i = index * 3;
            values.push(
                item.ID_producto_pedido,
                item.fecha_envio ?? null,
                item.fecha_recibido ?? null
            );
            return `($${i + 1}, $${i + 2}, $${i + 3})`;
        }).join(', ');

        const query = `
            INSERT INTO public.status_fecha ("ID_producto_pedido", "fecha_envio", "fecha_recibido")
            VALUES ${placeholders}
            RETURNING *
        `;

        const result = await client.query(query, values);
        return result.rows;
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

        statusUpdates.forEach((item, index) => {
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
    } finally {
        client.release();
    }
}

const minusStock = async (OrderProducts) => {
    const client = await pool.connect();

    try {
        // Validación de existencia y stock suficiente
        const condiciones = OrderProducts.map((p, i) =>
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

        for (const item of OrderProducts) {
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

        const updatePromises = OrderProducts.map(p => {
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

const getProductBrute = async (excludedPointOfSale) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `
            WITH cantidades_ajustadas AS (
                SELECT p."ID",
                       p.nombre,
                       p.tipo,
                       pvp."ID_punto_venta",
                       pvp.cantidad,
                       row_number() OVER (PARTITION BY pvp."ID_producto" ORDER BY pvp."ID_punto_venta") AS rn
                  FROM producto p
                  JOIN punto_venta_producto pvp ON p."ID" = pvp."ID_producto"
                 WHERE pvp."ID_punto_venta" != $1  -- Exclusión dinámica de ID_punto_venta
            ),
            cantidades_filtradas AS (
                SELECT cantidades_ajustadas."ID",
                       cantidades_ajustadas.nombre,
                       cantidades_ajustadas.tipo,
                       CASE
                           WHEN cantidades_ajustadas.rn = 1 THEN cantidades_ajustadas.cantidad
                           WHEN (cantidades_ajustadas.cantidad - 20) > 20 THEN cantidades_ajustadas.cantidad - 20
                           ELSE 0
                       END AS cantidad_ajustada
                  FROM cantidades_ajustadas
            ),
            cantidades_finales AS (
                SELECT cantidades_filtradas."ID",
                       cantidades_filtradas.nombre,
                       cantidades_filtradas.tipo,
                       sum(cantidades_filtradas.cantidad_ajustada) AS cantidad_total
                  FROM cantidades_filtradas
                 WHERE cantidades_filtradas.cantidad_ajustada > 0
                 GROUP BY cantidades_filtradas."ID", cantidades_filtradas.nombre, cantidades_filtradas.tipo
            )
            SELECT "ID",
                   nombre,
                   tipo,
                   cantidad_total
              FROM cantidades_finales;
            `,
            [excludedPointOfSale]  // Pasamos el valor dinámico para la exclusión
        );
        return result.rows; 
    } finally {
        client.release();
    }
}


const getProductByPointSell = async (ID_almacen) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT * FROM public.punto_venta_producto WHERE !=$1 ORDER BY "ID_punto_venta" ASC, "ID_producto" ASC '
            [ID_almacen]
        );
        return result.rows; 
    } finally {
        client.release();
    }
}

const getProductByPointSellByID = async (ID_punto_venta) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT * FROM public.list_producto_point WHERE "ID_punto_venta" = $1',
            [ID_punto_venta]
        );
        return result.rows; 
    } finally {
        client.release();
    }
}

const getOrderByidManager = async (ID_encargado) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT * FROM public.list_order_manager WHERE "ID_encargado" = $1',
            [ID_encargado]
        );
        return result.rows;
    } finally {
        client.release();
    }
}

const getRequestsByManager = async (ID_encargado) => {
    const pendiente = 'Pendiente'
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT * FROM public.pedido_producto WHERE "ID_almacen" = $1 AND "status" = $2',
            [ID_encargado, pendiente]
        );
        return result.rows;
    } finally {
        client.release();
    }
}


module.exports = {
    createOrder,
    createOrderDetails,
    createStatusDates,
    updateStatus,
    minusStock,
    getProductBrute,
    getProductByPointSell,
    getOrderByidManager,
    getRequestsByManager,
    getProductByPointSellByID
};
