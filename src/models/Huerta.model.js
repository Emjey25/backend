import mongoose from "mongoose";

const huertaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre es obligatorio'],
        trim: true,
    },
    descripcion: {
        type: String,
        trim: true,
    },
    ubicacion: {
        direccion: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number },
    },
    area: {
        type: Number, // en m²
        default: 0,
    },
    responsable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    estado: {
        type: String,
        enum: ['activa', 'inactiva', 'en_preparacion'],
        default: 'activa',
    },
    imagen: {
        type: String,
        default: null,
    },
},
    { timestamps: true });

export default mongoose.model('Huerta', huertaSchema);



