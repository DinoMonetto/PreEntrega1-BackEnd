// Importa express y otras dependencias
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Crea una instancia de la aplicación express
const app = express();

// Importa los enrutadores de productos y carritos
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';

// Importa el middleware errorHandler
import { errorHandler } from './middlewares/errorHandler.js';

// Middleware para analizar el cuerpo de las solicitudes entrantes como JSON
app.use(express.json());

// Asocia los enrutadores a las rutas correspondientes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Middleware para manejar errores
app.use(errorHandler);

// Define el directorio de archivos estáticos
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Define el puerto en el que la aplicación escuchará las solicitudes
const PORT = process.env.PORT || 8080;

// Inicia el servidor y le hace escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});
