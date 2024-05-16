import express from 'express';
import fs from 'fs/promises'; // Importa fs como fs/promises para utilizar los métodos asíncronos
import path from 'path';
import CartManager from '../managers/cart.manager.js';
import { __dirname } from '../path.js';

const router = express.Router();
const cartsFilePath = path.join(__dirname, '../data/carts.json');

const cartManager = new CartManager(cartsFilePath);

// Funciones auxiliares para obtener y guardar carritos
const getCarts = async () => {
  try {
    const data = await fs.readFile(cartsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveCarts = async (carts) => {
  await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
};

router.post('/', async (req, res) => {
  const carts = await getCarts();
  // Crea un nuevo carrito con un ID único y un array vacío de productos
  const newCart = {
    id: (carts.length + 1).toString(),
    products: [],
  };
  carts.push(newCart);
  // Guarda el nuevo carrito en el archivo
  await saveCarts(carts);
  res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
  const carts = await getCarts();
  // Busca el carrito correspondiente al ID proporcionado
  const cart = carts.find((c) => c.id === req.params.cid);
  if (!cart) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }
  // Envia una respuesta con los productos del carrito encontrado
  res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const carts = await getCarts();
  // Busca el carrito correspondiente al ID proporcionado
  const cart = carts.find((c) => c.id === req.params.cid);
  if (!cart) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }
  // Busca si el producto ya existe en el carrito
  const existingProduct = cart.products.find((p) => p.product === req.params.pid);
  if (existingProduct) {
    // Si el producto ya existe, incrementa su cantidad en 1
    existingProduct.quantity += 1;
  } else {
    // Si el producto no existe, lo agrega al carrito con una cantidad de 1
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }
  // Guarda los cambios en el archivo de carritos
  await saveCarts(carts);
  res.status(201).json(cart);
});

export default router;
