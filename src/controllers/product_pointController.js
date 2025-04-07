const productPointModel = require('../models/product_pointModel');

const getProductPointPrincipal = async (req, res) => {
    try {
        const productPoint = await productPointModel.getProductPointPrincipal();
        res.status(200).json(productPoint);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el punto de venta principal', error });
    }
}

const getProductPoint = async (req, res) => {
    try {
        const { id } = req.params;
        const productPoint = await productPointModel.getProductPoint(id);
        if (!productPoint) {
            return res.status(404).json({ message: 'Punto de venta no encontrado' });
        }
        res.status(200).json(productPoint);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener el punto de venta', error });
    }
}


const createProductPoint = async (req, res) => {
    try {
        const productPoint = await productPointModel.createProductPoint(req.body);
        res.status(201).json(productPoint);
        } catch (error) {
            res.status(500).json({ message: 'Error al ingresar producto', error });
        
    }
}

const updateProductPoint = async (req, res) => {
    try {  
        const { id } = req.params;
        const productPoint = await productPointModel.updateProductPoint(id,req.body);
        res.status(200).json(productPoint); 
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el punto de venta', error });
            }
}
const deleteProductPoint = async (req, res) => {
    try {
        const { id } = req.params;
        await productPointModel.deleteProductPoint(id);
        res.status(200).json({ message: 'Punto de venta eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el punto de venta', error });
    }
}

module.exports = {
    getProductPointPrincipal,
    getProductPoint,
    createProductPoint,
    updateProductPoint,
    deleteProductPoint
};