// se exporta una función llamada errorHandler como una constante
export const errorHandler = (error, req, res, next) => {
    // Imprime en la consola el mensaje de error
    console.log( `error ${error.message}`) 
    // se estable el código de estado HTTP del error, si no se proporciona, se establece en 500 
    const status = error.status || 500
    // Envia una respuesta con el código de estado y el mensaje de error al cliente
    res.status(status).send(error.message)
}
