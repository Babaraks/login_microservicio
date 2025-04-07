const pointSellModel = require('../models/point_sellModel.js');

const getPointSell = async (req, res) => {
    try {
        const pointSell = await pointSellModel.getPointSell();
        res.status(200).json(pointSell);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los puntos de venta', error });
    }
}

const getPointSellById = async (req, res) => {
    try {
        const { id } = req.params;
        const pointSell = await pointSellModel.getPointSellById(id);
        if (!pointSell) {
            return res.status(404).json({ message: 'Punto de venta no encontrado' });
        }
        res.status(200).json(pointSell);
    }

    catch (error) {
        res.status(500).json({ message: 'Error al obtener el punto de venta', error });
    }
}

const createPointSell = async (req, res) => {
    try {
        const newPointSell = await pointSellModel.createPointSell(req.body);
        res.status(201).json(newPointSell);
    }

    catch (error) {
        res.status(500).json({ message: 'Error al crear el punto de venta', error });
    }
}

const updatePointSell = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPointSell = await pointSellModel.updatePointSell(id, req.body);
        if (!updatedPointSell) {
            return res.status(404).json({ message: 'Punto de venta no encontrado' });
        }
        res.status(200).json(updatedPointSell);
    }

    catch (error) {
        res.status(500).json({ message: 'Error al actualizar el punto de venta', error });
    }
}

const deletePointSell = async (req, res) => {
    try {
        const { id } = req.params;
        await pointSellModel.deletePointSell(id);
        res.status(200).json({ message: 'Punto de venta eliminado' });
    }

    catch (error) {
        res.status(500).json({ message: 'Error al eliminar el punto de venta', error });
    }
}

module.exports = {
    getPointSell,
    getPointSellById,
    createPointSell,
    updatePointSell,
    deletePointSell
}