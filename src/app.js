// Importa express y otras dependencias
const express = require('express');
const fs = require('fs');
const path = require('path');

// Crea una instancia de la aplicación express
const app = express();

// Importa los enrutadores de productos y carritos
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

// Importa el middleware errorHandler
const { errorHandler } = require('../middlewares/errorhandler');

// Middleware para analizar el cuerpo de las solicitudes entrantes como JSON
app.use(express.json());

// Asocia los enrutadores a las rutas correspondientes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Middleware para manejar errores
app.use(errorHandler);

// Define el puerto en el que la aplicación escuchará las solicitudes
const PORT = 8080;

// Inicia el servidor y le hace escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});
