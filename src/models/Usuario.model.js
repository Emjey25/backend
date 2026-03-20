import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre es obligatorio'],
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, 'el email es obligatorio'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'el email no es valido']
    },
    password: {
        type: String,
        required: [true, 'la contraseña es obligatoria'],
        trim: true,
        minlength: 6,
        maxlength: 100
    },
    rol: {
        type: String,
        enum: ['admin', 'voluntario', 'donante'],
        default: 'voluntario'
    },
    avatar: {
        type: String,
        default: null,
    },
    activo: {
        type: Boolean,
        default: true,
    },

}, { timestamps: true });

//encriptar contraseña antes de guardar
usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// metodo para comparar contraseñas
usuarioSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model('Usuario', usuarioSchema);
