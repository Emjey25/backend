import Cultivo from '../models/Cultivo.model.js';

// GET /api/cultivos
export const getCultivos = async (req, res) => {
    try {
        const { huerta, estado, tipo } = req.query;
        const filtro = {};
        if (huerta) filtro.huerta = huerta;
        if (estado) filtro.estado = estado;
        if (tipo) filtro.tipo = tipo;

        const cultivos = await Cultivo.find(filtro)
            .populate('huerta', 'nombre ubicacion')
            .sort({ createdAt: -1 });

        res.json({ ok: true, total: cultivos.length, cultivos });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

// GET /api/cultivos/:id
export const getCultivo = async (req, res) => {
    try {
        const cultivo = await Cultivo.findById(req.params.id).populate('huerta', 'nombre ubicacion');
        if (!cultivo) return res.status(404).json({ ok: false, mensaje: 'Cultivo no encontrado' });
        res.json({ ok: true, cultivo });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

// POST /api/cultivos
export const crearCultivo = async (req, res) => {
    try {
        const cultivo = await Cultivo.create(req.body);
        res.status(201).json({ ok: true, cultivo });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// PUT /api/cultivos/:id
export const actualizarCultivo = async (req, res) => {
    try {
        // Si se marca como cosechada, registrar fecha
        if (req.body.estado === 'cosechada' && !req.body.fechaCosechaReal) {
            req.body.fechaCosechaReal = new Date();
        }
        const cultivo = await Cultivo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!cultivo) return res.status(404).json({ ok: false, mensaje: 'Cultivo no encontrado' });
        res.json({ ok: true, cultivo });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// DELETE /api/cultivos/:id
export const eliminarCultivo = async (req, res) => {
    try {
        const cultivo = await Cultivo.findByIdAndDelete(req.params.id);
        if (!cultivo) return res.status(404).json({ ok: false, mensaje: 'Cultivo no encontrado' });
        res.json({ ok: true, mensaje: 'Cultivo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

