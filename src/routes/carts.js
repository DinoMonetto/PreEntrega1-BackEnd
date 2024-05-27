import express from 'express';
import path from 'path';
import CartManager from '../managers/cart.manager.js';
import { __dirname } from '../path.js';

const router = express.Router();
const cartsFilePath = path.join(__dirname, '../src/data/carts.json'); // Corrección aquí

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
  try {
    const carts = await getCarts();
    const newCart = {
      id: uuidv4(),
      products: [],
    };
    carts.push(newCart);
    await saveCarts(carts);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const carts = await getCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const carts = await getCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const existingProduct = cart.products.find(p => p.product === req.params.pid);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    await saveCarts(carts);
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto al carrito' });
  }
});

export default router;
