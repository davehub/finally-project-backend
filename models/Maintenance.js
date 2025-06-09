const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
    device: { // Référence à l'équipement concerné
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    scheduledDate: { // Date prévue pour la maintenance
        type: Date,
        required: true
    },
    completionDate: { // Date de réalisation de la maintenance
        type: Date
    },
    type: { // Type de maintenance (préventive, corrective, évolutive)
        type: String,
        enum: ['préventive', 'corrective', 'évolutive'],
        required: true
    },
    description: { // Description du problème ou de l'intervention
        type: String,
        required: true,
        trim: true
    },
    performedBy: { // Technicien ou utilisateur ayant effectué la maintenance
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: { // Statut de la maintenance (planifiée, en cours, terminée, annulée)
        type: String,
        enum: ['planifiée', 'en cours', 'terminée', 'annulée'],
        default: 'planifiée'
    },
    cost: { // Coût de la maintenance
        type: Number,
        default: 0
    },
    notes: { // Notes additionnelles
        type: String,
        trim: true
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

MaintenanceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);