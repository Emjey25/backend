const Donacion = require('../models/Donacion.model');

// GET /api/donaciones
exports.getDonaciones = async (req, res) => {
    try {
        const { tipo, estado, huerta } = req.query;
        const filtro = {};
        if (tipo) filtro.tipoDonacion = tipo;
        if (estado) filtro.estado = estado;
        if (huerta) filtro.huerta = huerta;

        const donaciones = await Donacion.find(filtro)
            .populate('huerta', 'nombre')
            .sort({ fechaDonacion: -1 });

        res.json({ ok: true, total: donaciones.length, donaciones });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

// GET /api/donaciones/:id
exports.getDonacion = async (req, res) => {
    try {
        const donacion = await Donacion.findById(req.params.id).populate('huerta', 'nombre ubicacion');
        if (!donacion) return res.status(404).json({ ok: false, mensaje: 'Donación no encontrada' });
        res.json({ ok: true, donacion });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

// POST /api/donaciones
exports.crearDonacion = async (req, res) => {
    try {
        const donacion = await Donacion.create(req.body);
        res.status(201).json({ ok: true, donacion });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// PUT /api/donaciones/:id
exports.actualizarDonacion = async (req, res) => {
    try {
        const donacion = await Donacion.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!donacion) return res.status(404).json({ ok: false, mensaje: 'Donación no encontrada' });
        res.json({ ok: true, donacion });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// DELETE /api/donaciones/:id
exports.eliminarDonacion = async (req, res) => {
    try {
        const donacion = await Donacion.findByIdAndDelete(req.params.id);
        if (!donacion) return res.status(404).json({ ok: false, mensaje: 'Donación no encontrada' });
        res.json({ ok: true, mensaje: 'Donación eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};