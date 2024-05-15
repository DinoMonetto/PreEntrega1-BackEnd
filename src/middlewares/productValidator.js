// Define un middleware llamado productValidator
export const productValidator = (req, res, next) => {
    // Verifica si alguno de los campos requeridos está ausente en el cuerpo de la solicitud
    if (
        req.body.title === undefined ||
        req.body.description === undefined ||
        req.body.code === undefined ||
        req.body.price === undefined ||
        req.body.stock === undefined ||
        req.body.category === undefined
    ) {
        // Si falta alguno de los campos, envia una respuesta con un código de estado 404 y un mensaje de error
        res.status(404).json({ msg: 'Cuerpo de la solicitud inválido' });
    } else {
        // Si todos los campos requeridos están presentes, pasa al siguiente middleware o controlador
        next();
    }
}
