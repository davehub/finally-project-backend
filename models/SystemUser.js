const mongoose = require('mongoose');
const SystemUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Sera haché en bcrypt
    role: { type: String, enum: ['admin', 'technician', 'viewer'], default: 'viewer' },
    email: { type: String, unique: true, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SystemUser', SystemUserSchema);

