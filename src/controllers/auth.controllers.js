import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.model.js';

const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// POST /api/auth/registro
export const registro = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ ok: false, mensaje: 'El email ya está registrado' });
        }

        const usuario = await Usuario.create({ nombre, email, password, rol });
        const token = generarToken(usuario._id);

        res.status(201).json({
            ok: true,
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ ok: false, mensaje: 'Email y contraseña son requeridos' });
        }

        const usuario = await Usuario.findOne({ email }).select('+password');
        if (!usuario || !(await usuario.comparePassword(password))) {
            return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas' });
        }

        if (!usuario.activo) {
            return res.status(401).json({ ok: false, mensaje: 'Cuenta desactivada' });
        }

        const token = generarToken(usuario._id);

        res.json({
            ok: true,
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                avatar: usuario.avatar,
            },
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

// GET /api/auth/perfil
export const perfil = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario._id);
        res.json({ ok: true, usuario });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

// PUT /api/auth/perfil
export const actualizarPerfil = async (req, res) => {
    try {
        const { nombre, avatar } = req.body;
        const usuario = await Usuario.findByIdAndUpdate(
            req.usuario._id,
            { nombre, avatar },
            { new: true, runValidators: true }
        );
        res.json({ ok: true, usuario });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};