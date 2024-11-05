const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    telephone: { type: String, required: false, unique: true },
    isAdmin: { type: Boolean, default: false },
    notifyTrafficDecree: { type: Boolean, default: true },
    notifyReportsOnInterestZones: { type: Boolean, default: true },
    notifyGeneralImportant: { type: Boolean, default: true },
});

// Middleware para encriptar la contraseña
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.statics.findByCredentials = async (email, password) => {
    // Buscar al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Contraseña incorrecta');
    }

    return user;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
