// Importa las dependencias necesarias
const express = require('express');
const fs = require('fs');
const path = require('path');

// Crea un enrutador de express
const router = express.Router();

// Define la ruta del archivo de carritos
const cartsFilePath = path.join(__dirname, '../data/carts.json');

// Funciones auxiliares para obtener y guardar los carritos
const getCarts = () => {
    // Lee el archivo de carritos y lo convierte a un objeto JavaScript
    const data = fs.readFileSync(cartsFilePath, 'utf-8');
    return JSON.parse(data);
};

const saveCarts = (carts) => {
    // Convierte el objeto JavaScript de carritos a formato JSON y lo escribe en el archivo de carritos
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

// Crea un nuevo carrito
router.post('/', (req, res) => {
    const carts = getCarts();
    // Crea un nuevo carrito con un ID único y un array vacío de productos
    const newCart = {
        id: (carts.length + 1).toString(),
        products: []
    };
    // Agrega el nuevo carrito a la lista de carritos y lo guarda en el archivo
    carts.push(newCart);
    saveCarts(carts);
    // Envia una respuesta con el nuevo carrito y un código de estado 201
    res.status(201).json(newCart);
});

// Lista los productos en un carrito por su ID
router.get('/:cid', (req, res) => {
    const carts = getCarts();
    // Busca el carrito correspondiente al ID proporcionado
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        // Si no se encuentra el carrito, envia una respuesta con un código de estado 404
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    // Envia una respuesta con los productos del carrito encontrado
    res.json(cart.products);
});

// Agrega un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const carts = getCarts();
    // Busca el carrito correspondiente al ID proporcionado
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        // Si no se encuentra el carrito, envia una respuesta con un código de estado 404
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    // Buscasi el producto ya existe en el carrito
    const existingProduct = cart.products.find(p => p.product === req.params.pid);
    if (existingProduct) {
        // Si el producto ya existe, incrementa su cantidad en 1
        existingProduct.quantity += 1;
    } else {
        // Si el producto no existe, lo agrega al carrito con una cantidad de 1
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }
    // Guarda los cambios en el archivo de carritos
    saveCarts(carts);
    // Envia una respuesta con el carrito modificado y un código de estado 201
    res.status(201).json(cart);
});

// Exporta el enrutador para su uso en otros archivos
module.exports = router;
