import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, 'El título es obligatorio'],
            trim: true,
        },
        descripcion: {
            type: String,
        },
        huerta: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Huerta',
            required: true,
        },
        asignadoA: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Voluntario',
        },
        cultivo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cultivo',
            default: null,
        },
        tipo: {
            type: String,
            enum: ['riego', 'siembra', 'cosecha', 'fertilizacion', 'control_plagas', 'limpieza', 'otro'],
            default: 'otro',
        },
        prioridad: {
            type: String,
            enum: ['baja', 'media', 'alta', 'urgente'],
            default: 'media',
        },
        estado: {
            type: String,
            enum: ['pendiente', 'en_proceso', 'completada', 'cancelada'],
            default: 'pendiente',
        },
        fechaLimite: {
            type: Date,
        },
        fechaCompletada: {
            type: Date,
            default: null,
        },
        notas: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Tarea', tareaSchema);
