import fs from 'fs/promises'; // Importa fs como fs/promises para utilizar los métodos asíncronos
import { v4 as uuidv4 } from 'uuid';

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getAllCarts() {
    try {
      const carts = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(carts);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async saveCarts(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      console.log(error);
    }
  }

  async createCart() {
    try {
      const carts = await this.getAllCarts();
      const newCart = {
        id: uuidv4(),
        products: [],
      };
      carts.push(newCart);
      await this.saveCarts(carts);
      return newCart;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getAllCarts();
      return carts.find(cart => cart.id === id);
    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const carts = await this.getAllCarts();
      const cart = carts.find(c => c.id === cid);
      if (!cart) {
        return null;
      }

      const existingProduct = cart.products.find(p => p.product === pid);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await this.saveCarts(carts);
      return cart;
    } catch (error) {
      console.log(error);
    }
  }
}
