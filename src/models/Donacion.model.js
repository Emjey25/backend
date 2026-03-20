import mongoose from "mongoose";

const donacionSchema = new mongoose.Schema(
    {
        donante: {
            nombre: { type: String, required: true },
            tipo: {
                type: String,
                enum: ['empresa', 'persona', 'institucion'],
                default: 'empresa',
            },
            contacto: { type: String },
        },
        huerta: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Huerta',
            default: null,
        },
        tipoDonacion: {
            type: String,
            enum: ['semillas', 'herramientas', 'fertilizantes', 'agua', 'monetario', 'otro'],
            default: 'semillas',
        },
        descripcion: {
            type: String,
            required: true,
        },
        cantidad: {
            type: Number,
        },
        unidad: {
            type: String,
        },
        valorEstimado: {
            type: Number, // en moneda local
            default: 0,
        },
        estado: {
            type: String,
            enum: ['recibida', 'pendiente', 'rechazada'],
            default: 'pendiente',
        },
        fechaDonacion: {
            type: Date,
            default: Date.now,
        },
        emoji: {
            type: String,
            default: '🌽',
        },
        notas: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Donacion', donacionSchema);