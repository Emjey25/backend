import mongoose from "mongoose";

const cultivoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
        },
        tipo: {
            type: String,
            enum: ['hortaliza', 'fruta', 'hierba', 'cereal', 'legumbre', 'otro'],
            default: 'hortaliza',
        },
        huerta: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Huerta',
            required: true,
        },
        estado: {
            type: String,
            enum: ['semilla', 'germinacion', 'crecimiento', 'fruicion', 'lista_cosechar', 'cosechada'],
            default: 'semilla',
        },
        fechaSiembra: {
            type: Date,
        },
        fechaCosechaEstimada: {
            type: Date,
        },
        fechaCosechaReal: {
            type: Date,
            default: null,
        },
        cantidadSembrada: {
            type: Number, // en gramos o unidades
            default: 0,
        },
        cantidadCosechada: {
            type: Number,
            default: 0,
        },
        unidad: {
            type: String,
            enum: ['kg', 'g', 'unidades', 'litros'],
            default: 'kg',
        },
        notas: {
            type: String,
        },
        emoji: {
            type: String,
            default: '🌱',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Cultivo', cultivoSchema);