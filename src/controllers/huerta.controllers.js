import Huerta from '../models/Huerta.model.js';

// GET /api/huertas
export const getHuertas = async (req, res) => {
    try {
        const { estado, page = 1, limit = 10 } = req.query;
        const filtro = {};
        if (estado) filtro.estado = estado;

        const skip = (page - 1) * limit;
        const [huertas, total] = await Promise.all([
            Huerta.find(filtro).populate('responsable', 'nombre email').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
            Huerta.countDocuments(filtro),
        ]);

        res.json({ ok: true, total, pagina: Number(page), huertas });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

// GET /api/huertas/:id
export const getHuerta = async (req, res) => {
    try {
        const huerta = await Huerta.findById(req.params.id).populate('responsable', 'nombre email rol');
        if (!huerta) return res.status(404).json({ ok: false, mensaje: 'Huerta no encontrada' });
        res.json({ ok: true, huerta });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

// POST /api/huertas
export const crearHuerta = async (req, res) => {
    try {
        const huerta = await Huerta.create(req.body);
        res.status(201).json({ ok: true, huerta });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// PUT /api/huertas/:id
export const actualizarHuerta = async (req, res) => {
    try {
        const huerta = await Huerta.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!huerta) return res.status(404).json({ ok: false, mensaje: 'Huerta no encontrada' });
        res.json({ ok: true, huerta });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// DELETE /api/huertas/:id
export const eliminarHuerta = async (req, res) => {
    try {
        const huerta = await Huerta.findByIdAndDelete(req.params.id);
        if (!huerta) return res.status(404).json({ ok: false, mensaje: 'Huerta no encontrada' });
        res.json({ ok: true, mensaje: 'Huerta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};