const sellModel = require('../models/sellModel');

const createSell = async (req, res) => {
    try {
        const sell = req.body;
        const newsell = await sellModel.createSell(sell);
        res.status(201).json(newsell);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const createSellProducts = async (req, res) => {
    try {
        const sellProducts = req.body;

        // Validación básica
        if (!Array.isArray(sellProducts) || sellProducts.length === 0) {
            return res.status(400).json({ message: 'Se espera un arreglo de productos a vender.' });
        }

        for (const product of sellProducts) {
            if (
                !product.ID_producto ||
                !product.ID_venta ||
                typeof product.cantidad !== 'number'
            ) {
                return res.status(400).json({ message: 'Datos inválidos en uno o más productos.' });
            }
        }

        const createdProducts = await sellModel.createSellProducts(sellProducts);
        return res.status(201).json(createdProducts);
    } catch (error) {
        console.error('Error en controller al crear productos de venta:', error);
        return res.status(500).json({ message: 'Error al crear los productos de la venta.' });
    }
};
const minusStock = async (req, res) => {
    try {
        const sellProducts = req.body;

        // Validación básica del request
        if (!Array.isArray(sellProducts) || sellProducts.length === 0) {
            return res.status(400).json({
                message: 'Se espera un arreglo con objetos que contengan ID_punto_venta, ID_producto y cantidad.'
            });
        }

        for (const item of sellProducts) {
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
        const result = await sellModel.minusStock(sellProducts);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getAllpointproducts = async (req, res) => {
    try {
        const id = req.params.id;
        const products = await sellModel.getAllpointproducts(id);
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }   
}


const getAllSells = async (req, res) => {
    try {
        const sells = await sellModel.getAllSells();
        res.json(sells);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
}

module.exports = {  
    createSell,
    createSellProducts,
    minusStock,
    getAllpointproducts
};