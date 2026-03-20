const Huerta = require('../models/Huerta.model');
const Cultivo = require('../models/Cultivo.model');
const Voluntario = require('../models/Voluntario.model');
const Tarea = require('../models/Tarea.model');
const Donacion = require('../models/Donacion.model');

// GET /api/reportes/dashboard
// Devuelve todos los stats del Dashboard Principal
exports.getDashboard = async (req, res) => {
    try {
        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

        const [
            totalHuertasActivas,
            cosechasProximas,
            voluntariosHoy,
            tareasPendientes,
            tareasEnProceso,
            donacionesRecientes,
            cultivosEstado,
            rendimientoPorMes,
        ] = await Promise.all([
            // Total huertas activas
            Huerta.countDocuments({ estado: 'activa' }),

            // Cultivos listos para cosechar (cosechas próximas)
            Cultivo.countDocuments({ estado: 'lista_cosechar' }),

            // Voluntarios activos (simulado como los activos del sistema)
            Voluntario.countDocuments({ estado: 'activo' }),

            // Tareas pendientes
            Tarea.countDocuments({ estado: 'pendiente' }),

            // Tareas en proceso
            Tarea.countDocuments({ estado: 'en_proceso' }),

            // Donaciones recientes (últimas 5)
            Donacion.find().sort({ fechaDonacion: -1 }).limit(5).populate('huerta', 'nombre'),

            // Estado de cultivos (agrupado)
            Cultivo.aggregate([
                { $group: { _id: '$estado', total: { $sum: 1 } } },
            ]),

            // Rendimiento de cosecha por mes (últimos 6 meses)
            Cultivo.aggregate([
                {
                    $match: {
                        estado: 'cosechada',
                        fechaCosechaReal: { $exists: true, $ne: null },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$fechaCosechaReal' },
                            month: { $month: '$fechaCosechaReal' },
                        },
                        totalCosechado: { $sum: '$cantidadCosechada' },
                        cantidad: { $sum: 1 },
                    },
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
                { $limit: 6 },
            ]),
        ]);

        // Tareas prioritarias (pendientes + en_proceso, ordenadas por prioridad)
        const tareasPrioritarias = await Tarea.find({
            estado: { $in: ['pendiente', 'en_proceso'] },
        })
            .populate('asignadoA', 'nombre apellido')
            .sort({ prioridad: -1, fechaLimite: 1 })
            .limit(5);

        res.json({
            ok: true,
            resumenMensual: {
                totalHuertasActivas,
                cosechasProximas,
                voluntariosHoy,
                tareasPendientes,
                tareasEnProceso,
            },
            tareasPrioritarias,
            donacionesRecientes,
            cultivosEstado,
            rendimientoPorMes,
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

// GET /api/reportes/cultivos
exports.getReporteCultivos = async (req, res) => {
    try {
        const { huerta, desde, hasta } = req.query;
        const filtro = { estado: 'cosechada' };
        if (huerta) filtro.huerta = huerta;
        if (desde || hasta) {
            filtro.fechaCosechaReal = {};
            if (desde) filtro.fechaCosechaReal.$gte = new Date(desde);
            if (hasta) filtro.fechaCosechaReal.$lte = new Date(hasta);
        }

        const reporte = await Cultivo.aggregate([
            { $match: filtro },
            {
                $group: {
                    _id: '$tipo',
                    totalCosechado: { $sum: '$cantidadCosechada' },
                    cantidadCultivos: { $sum: 1 },
                },
            },
            { $sort: { totalCosechado: -1 } },
        ]);

        res.json({ ok: true, reporte });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

// GET /api/reportes/voluntarios
exports.getReporteVoluntarios = async (req, res) => {
    try {
        const voluntarios = await Voluntario.find({ estado: 'activo' })
            .populate('huertas', 'nombre')
            .sort({ horasAcumuladas: -1 })
            .limit(10);

        const totalHoras = voluntarios.reduce((acc, v) => acc + v.horasAcumuladas, 0);

        res.json({ ok: true, totalHoras, topVoluntarios: voluntarios });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

// GET /api/reportes/donaciones
exports.getReporteDonaciones = async (req, res) => {
    try {
        const resumen = await Donacion.aggregate([
            {
                $group: {
                    _id: '$tipoDonacion',
                    total: { $sum: 1 },
                    valorTotal: { $sum: '$valorEstimado' },
                },
            },
            { $sort: { total: -1 } },
        ]);

        res.json({ ok: true, resumen });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};