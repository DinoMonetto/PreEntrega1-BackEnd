// Importa fs como fs/promises para utilizar los métodos asíncronos
import fs from 'fs/promises';
import { v4 as uuidv4 } from "uuid";

import ProductManager from "./product.manager.js";
import { __dirname } from "../path.js";

const productManager = new ProductManager(`${__dirname}/db/products.json`);

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getAllCarts() {
    try {
      const carts = await fs.readFile(this.path, "utf-8");
      return JSON.parse(carts);
    } catch (error) {
      // Si hay un error al leer el archivo, devuelve un array vacío
      console.log(error);
      return [];
    }
  }

  async createCart() {
    try {
      // Crea un nuevo carrito con un ID único y un array vacío de productos
      const cart = {
        id: uuidv4(),
        products: [],
      }
      const carts = await this.getAllCarts();
      carts.push(cart);
      // Guarda el nuevo carrito en el archivo
      await fs.writeFile(this.path, JSON.stringify(carts));
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getAllCarts();
      // Busca el carrito correspondiente al ID proporcionado
      const cart = carts.find((c) => c.id === id);
      if (!cart) return null;
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async saveProductToCart(idCart, idProduct) {
    try {
      const prodExist = await productManager.getProductById(idProduct);
      if(!prodExist) throw new Error('Product not found');
      let carts = await this.getAllCarts();
      const cartExist = await this.getCartById(idCart);
      if(!cartExist) throw new Error('Cart not found');
      const existProdInCart = cartExist.products.find((prod) => prod.product === idProduct);
      if(!existProdInCart){
        // Si el producto no existe en el carrito, se agrega con una cantidad de 1
        const prod = {
          product: idProduct,
          quantity: 1
        };
        cartExist.products.push(prod);
      } else {
        // Si el producto ya existe en el carrito, se incrementa su cantidad
        existProdInCart.quantity += 1;
      }
      // Actualiza los carritos en el archivo con los cambios realizados
      const updatedCarts = carts.map((cart) => {
        if(cart.id === idCart) return cartExist
        return cart
      })
      await fs.writeFile(this.path, JSON.stringify(updatedCarts));
      return cartExist
    } catch (error) {
      console.log(error);
    }
  }
}
