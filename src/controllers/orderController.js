const orderModel = require('../models/orderModel');


const createOrder = async (req, res) => {
    try {
        const order = req.body;
        const newOrder = await orderModel.createOrder(order);

        // 🚀 Obtener socket y usuarios conectados
        const io = req.app.get('socketio');
        const usuariosConectados = req.app.get('usuariosConectados');

        // 🚀 Aquí defines a quién quieres mandarle la notificación
        const encargadoId = order.ID_encargado;  // Por ejemplo, del pedido
        const socketId = usuariosConectados[encargadoId];

        if (socketId) {
            io.to(socketId).emit('nuevoPedido', newOrder);
            console.log(`📩 Notificación enviada a usuario ${encargadoId}`);
        } else {
            console.log(`⚠️ Usuario ${encargadoId} no conectado.`);
        }

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ message: 'Error al crear el pedido' });
    }
}

const createOrderDetails = async (req, res) => {
    try {
        const orderDetails = req.body;
        const newOrderDetails = await orderModel.createOrderDetails(orderDetails);
        res.status(201).json(newOrderDetails);
    } catch (error) {
        console.error('Error al crear los detalles del pedido:', error);
        res.status(500).json({ message: 'Error al crear los detalles del pedido' });
    }
}
const createStatusDates = async (req, res) => {
    try {
        const statusDates = req.body;
        const newStatusDates = await orderModel.createStatusDates(statusDates);
        res.status(201).json(newStatusDates);
    } catch (error) {
        console.error('Error al crear las fechas de estado:', error);
        res.status(500).json({ message: 'Error al crear las fechas de estado' });
    }
}

const updateStatus = async (req, res) => {
    try {
        const status = req.body;
        const updatedStatus = await orderModel.updateStatus(status);
        res.status(200).json(updatedStatus);
    }
    catch (error) {
        console.error('Error al actualizar el estado:', error);
        res.status(500).json({ message: 'Error al actualizar el estado' });
    }
}

const minusStock = async (req, res) => {
    try {
        const OrderProducts = req.body;

        // Validación básica del request
        if (!Array.isArray(OrderProducts) || OrderProducts.length === 0) {
            return res.status(400).json({
                message: 'Se espera un arreglo con objetos que contengan ID_punto_venta, ID_producto y cantidad.'
            });
        }

        for (const item of OrderProducts) {
            if (
                typeof item.ID_punto_venta !== 'number' ||
                typeof item.ID_producto !== 'number' ||
                typeof item.cantidad !== 'number'
            ) {
                return res.status(400).json({
                    message: 'Cada item debe tener ID_punto_venta, ID_producto y cantidad como números.'
                });
            }
        }

        // Ejecutar la lógica
        const result = await orderModel.minusStock(OrderProducts);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getProductBrute = async (req, res) => {
    try {
        const productBrute = await orderModel.getProductBrute();
        res.status(200).json(productBrute);
    } catch (error) {
        console.error('Error al obtener el producto bruto:', error);
        res.status(500).json({ message: 'Error al obtener el producto bruto' });
    }
}

const getProductByPointSell = async (req, res) => {
    try {
        const { ID_punto_venta } = req.params;

        const products = await orderModel.getProductByPointSell(ID_punto_venta);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener los productos por punto de venta:', error);
        res.status(500).json({ message: 'Error al obtener los productos por punto de venta' });
    }
}

const getRequestsByManager = async (req, res) => {
    try {
        const { ID_encargado} = req.params;
        const requests = await orderModel.getRequestsByManager(ID_encargado);
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error al obtener las solicitudes por gerente:', error);
        res.status(500).json({ message: 'Error al obtener las solicitudes por gerente' });
    }
}

const getOrderByidManager = async (req, res) => {
    try {
        const { ID_encargado } = req.params;
        const orders = await orderModel.getOrderByidManager(ID_encargado);
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener los pedidos por gerente:', error);
        res.status(500).json({ message: 'Error al obtener los pedidos por gerente' });
    }
}

const getProductByPointSellByID = async (req, res) => {
    try {
        const { ID_punto_venta } = req.params;
        const products = await orderModel.getProductByPointSellByID(ID_punto_venta);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener los productos por punto de venta:', error);
        res.status(500).json({ message: 'Error al obtener los productos por punto de venta' });
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
    getRequestsByManager,
    getOrderByidManager,
    getProductByPointSellByID
};