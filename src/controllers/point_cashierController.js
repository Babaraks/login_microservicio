const pointcashierModel = require('../models/point_cashierModel');

const getPointcashier = async (req, res) => {
    try {
        const pointcashier = await pointcashierModel.getPointcashier();
        res.status(200).json(pointcashier);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los puntos de venta', error });
    }
}

const getPointcashierById_cajero = async (req, res) => {
    try {
        const { id } = req.params;
        const pointcashier = await pointcashierModel.getPointcashierById_cajero(id);
        if (!pointcashier) {
            return res.status(404).json({ message: 'Punto de venta no encontrado' });
        }
        res.status(200).json(pointcashier);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el punto de venta', error });
    }
}

const createPointcashier = async (req, res) => {
    try {
        
        const pointcashier = await pointcashierModel.createPointcashier(req.body);
        res.status(201).json(pointcashier);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el punto de venta', error });
    }
}

const updatePointcashier = async (req, res) => {
    try {
        const { id } = req.params;
        const pointcashier = await pointcashierModel.updatePointcashier(id, req.body);
        res.status(200).json(pointcashier);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el punto de venta', error });
    }
}

const deletePointcashier = async (req, res) => {
    try {
        const { id } = req.params;
        await pointcashierModel.deletePointcashier(id);
        res.status(200).json({ message: 'Punto de venta eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el punto de venta', error });
    }
}


module.exports = {
    getPointcashier,
    getPointcashierById_cajero,
    createPointcashier,
    updatePointcashier,
    deletePointcashier
};


