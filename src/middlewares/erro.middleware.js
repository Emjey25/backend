exports.errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error('❌ Error:', err);

    // Mongoose: ID inválido
    if (err.name === 'CastError') {
        return res.status(400).json({ ok: false, mensaje: 'ID de recurso inválido' });
    }

    // Mongoose: campo único duplicado
    if (err.code === 11000) {
        const campo = Object.keys(err.keyValue)[0];
        return res.status(400).json({ ok: false, mensaje: `El campo '${campo}' ya existe` });
    }

    // Mongoose: validación
    if (err.name === 'ValidationError') {
        const mensajes = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ ok: false, mensaje: mensajes.join('. ') });
    }

    // JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ ok: false, mensaje: 'Token inválido' });
    }

    res.status(error.statusCode || 500).json({
        ok: false,
        mensaje: error.message || 'Error interno del servidor',
    });
};

exports.notFound = (req, res) => {
    res.status(404).json({ ok: false, mensaje: `Ruta no encontrada: ${req.originalUrl}` });
};