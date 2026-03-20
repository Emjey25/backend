import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.model.js';

export const proteger = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ ok: false, mensaje: 'No autorizado. Token requerido.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findById(decoded.id);

        if (!usuario || !usuario.activo) {
            return res.status(401).json({ ok: false, mensaje: 'Usuario no encontrado o inactivo.' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado.' });
    }
};

export const restringirA = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({
                ok: false,
                mensaje: `Acceso denegado. Rol requerido: ${roles.join(', ')}`,
            });
        }
        next();
    };
};
