import mongoose from "mongoose";

const voluntarioSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
        },
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
        },
        apellido: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        telefono: {
            type: String,
        },
        huertas: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Huerta',
            },
        ],
        disponibilidad: {
            type: [String],
            enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
            default: [],
        },
        horasAcumuladas: {
            type: Number,
            default: 0,
        },
        estado: {
            type: String,
            enum: ['activo', 'inactivo', 'pendiente'],
            default: 'activo',
        },
        notas: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Voluntario', voluntarioSchema);