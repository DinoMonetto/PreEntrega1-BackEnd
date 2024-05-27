// Importa las dependencias necesarias
import express from 'express';
import fs from 'fs/promises'; // Cambiado a fs/promises para consistencia
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ProductManager from '../managers/product.manager.js';
import { __dirname } from "../path.js";

// Crea un enrutador de express
const router = express.Router();

// Importa el middleware productValidator
import { productValidator } from '../middlewares/productValidator.js';

// Define la ruta del archivo de productos
const productsFilePath = path.join(__dirname, 'data/products.json');
console.log('Ruta de archivo de productos:', productsFilePath);

const productManager = new ProductManager(productsFilePath);

// Lista todos los productos con un límite opcional
router.get('/', async (req, res) => {
    try {
        let products = await productManager.getProducts();
        const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
        products = products.slice(0, limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
});

// Obtiene un producto por su ID
router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
});

// Agrega un nuevo producto
router.post('/', productValidator, async (req, res) => {
    try {
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

        if (!title || !description || !code || price === undefined || stock === undefined || !category) {
            return res.status(400).json({ message: 'Se necesitan todos los campos excepto thumbnails' });
        }

        const newProduct = {
            id: uuidv4(),
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };

        const products = await productManager.getProducts();
        products.push(newProduct);
        await productManager.saveProducts(products);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto' });
    }
});

// Actualiza un producto por su ID
router.put('/:pid', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        const product = await productManager.getProductById(req.params.pid);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const updatedProduct = {
            ...product,
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(code !== undefined && { code }),
            ...(price !== undefined && { price }),
            ...(status !== undefined && { status }),
            ...(stock !== undefined && { stock }),
            ...(category !== undefined && { category }),
            ...(thumbnails !== undefined && { thumbnails })
        };

        const products = await productManager.getProducts();
        const index = products.findIndex(p => p.id === req.params.pid);
        products[index] = updatedProduct;
        await productManager.saveProducts(products);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

// Elimina un producto por su ID
router.delete('/:pid', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const filteredProducts = products.filter(p => p.id !== req.params.pid);

        if (products.length === filteredProducts.length) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        await productManager.saveProducts(filteredProducts);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});

// Exporta el enrutador para su uso en otros archivos
export default router;
