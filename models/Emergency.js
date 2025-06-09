const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
    device: { // Référence à l'équipement concerné par l'urgence
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    reportedBy: { // Utilisateur ayant signalé l'urgence
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportedDate: { // Date et heure de signalement
        type: Date,
        default: Date.now
    },
    issue: { // Description du problème urgent
        type: String,
        required: true,
        trim: true
    },
    priority: { // Priorité (faible, moyenne, élevée, critique)
        type: String,
        enum: ['faible', 'moyenne', 'élevée', 'critique'],
        default: 'moyenne'
    },
    status: { // Statut de l'urgence (nouvelle, en cours, résolue, fermée)
        type: String,
        enum: ['nouvelle', 'en cours', 'résolue', 'fermée'],
        default: 'nouvelle'
    },
    resolutionDetails: { // Détails de la résolution
        type: String,
        trim: true
    },
    resolvedBy: { // Technicien ayant résolu l'urgence
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolutionDate: { // Date et heure de résolution
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

EmergencySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Emergency', EmergencySchema);