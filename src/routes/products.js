// Importa express y otras dependencias
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Crea un enrutador de express
const router = express.Router();

// Importa el middleware productValidator
const { productValidator } = require('./middlewares/productvalidator');

// Define la ruta del archivo de productos
const productsFilePath = path.join(__dirname, '../data/products.json');

// Funciones auxiliares para obtener y guardar productos
const getProducts = () => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const saveProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Lista todos los productos con un límite opcional
router.get('/', (req, res) => {
    let products = getProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    products = products.slice(0, limit);
    res.json(products);
});

// Obtiene un producto por su ID
router.get('/:pid', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
});

// Agrega un nuevo producto
router.post('/', productValidator, (req, res) => {
    const products = getProducts();
    const newProduct = {
        id: uuidv4(),
        ...req.body,
        status: req.body.status !== undefined ? req.body.status : true
    };
    // Comprueba si se proporcionan todos los campos requeridos
    if (!newProduct.title || !newProduct.description || !newProduct.code || newProduct.price === undefined || newProduct.status === undefined || newProduct.stock === undefined || !newProduct.category) {
        return res.status(400).json({ message: 'Se necesitan todos los campos excepto thumbnails' });
    }

    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});

// Actualiza un producto por su ID
router.put('/:pid', (req, res) => {
    const products = getProducts();
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    const updatedProduct = { ...products[index], ...req.body };
    products[index] = updatedProduct;
    saveProducts(products);
    res.json(updatedProduct);
});

// Elimina un producto por su ID
router.delete('/:pid', (req, res) => {
    let products = getProducts();
    products = products.filter(p => p.id !== req.params.pid);
    saveProducts(products);
    res.status(204).send();
});

// Exporta el enrutador para su uso en otros archivos
module.exports = router;
