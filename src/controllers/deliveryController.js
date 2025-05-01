const deliveryModel = require('../models/deliveryModel');


const getAllDeliveries = async (req, res) => {
    const { ID_almacen } = req.params;
    try {
        const deliveries = await deliveryModel.getAllDeliveries(ID_almacen);
        res.status(200).json(deliveries);
    } catch (error) {
        console.error('Error fetching deliveries:', error);
        res.status(500).json({ error: 'Error fetching deliveries' });
    }
}

const updateStatus = async (req, res) => {
    try {
        const status = req.body;
        const updatedStatus = await deliveryModel.updateStatus(status);
        res.status(200).json(updatedStatus);
    }
    catch (error) {
        console.error('Error al actualizar el estado:', error);
        res.status(500).json({ message: 'Error al actualizar el estado' });
    }
}


const updateStock = async (req, res) => {
    try {
        const OrderProducts = req.body;  // Ahora directamente el arreglo de productos

        if (!Array.isArray(OrderProducts)) {
            return res.status(400).json({ message: 'El cuerpo de la solicitud debe ser un arreglo de productos' });
        }

        const result = await deliveryModel.plusStock(OrderProducts);
        return res.status(200).json(result);  // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en el controlador de actualización de stock:', error);
        return res.status(500).json({ message: 'Hubo un error al actualizar el stock', error: error.message });
    }
};


module.exports = {
    getAllDeliveries,
    updateStatus,
    updateStock
};