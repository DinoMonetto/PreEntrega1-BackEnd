// src/routes/products.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const productsFilePath = path.join(__dirname, '../data/products.json');

// Helper functions
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

// List all products with optional limit
router.get('/', (req, res) => {
    let products = getProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    products = products.slice(0, limit);
    res.json(products);
});

// Get a product by ID
router.get('/:pid', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
});

// Add a new product
router.post('/', (req, res) => {
    const products = getProducts();
    const newProduct = {
        id: uuidv4(),
        ...req.body,
        status: req.body.status !== undefined ? req.body.status : true
    };

    // Check for required fields
    if (!newProduct.title || !newProduct.description || !newProduct.code || newProduct.price === undefined || newProduct.status === undefined || newProduct.stock === undefined || !newProduct.category) {
        return res.status(400).json({ message: 'All fields except thumbnails are required' });
    }

    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});

// Update a product by ID
router.put('/:pid', (req, res) => {
    const products = getProducts();
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const updatedProduct = { ...products[index], ...req.body };
    products[index] = updatedProduct;
    saveProducts(products);
    res.json(updatedProduct);
});

// Delete a product by ID
router.delete('/:pid', (req, res) => {
    let products = getProducts();
    products = products.filter(p => p.id !== req.params.pid);
    saveProducts(products);
    res.status(204).send();
});

module.exports = router;
