const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['ordinateur', 'imprimante', 'reseau', 'serveur', 'autre']
    },
    serialNumber: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['actif', 'en panne', 'en reparation', 'stock', 'retire'],
        default: 'actif'
    },
    assignedTo: { // Utilisateur à qui l'équipement est attribué
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    location: { // Localisation physique de l'équipement
        type: String,
        trim: true
    },
    purchaseDate: {
        type: Date
    },
    warrantyEndDate: { // Date de fin de garantie
        type: Date
    },
    description: {
        type: String,
        trim: true
    },
    lastMaintenance: { // Dernière date de maintenance (peut être mise à jour via un hook ou manuellement)
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Mettre à jour 'updatedAt' à chaque sauvegarde
DeviceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Device', DeviceSchema);