const productModel = require('../models/productModel');

const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const createProduct = async (req, res) => {
    try {
        const product = req.body;
        const newProduct = await productModel.createProduct(product);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, tipo, precio } = req.body;
        const updatedProduct = await productModel.updateProduct(id, nombre, tipo, precio);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const message = await productModel.deleteProduct(id);
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};