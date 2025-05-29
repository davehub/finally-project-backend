const mongoose = require('mongoose');
const MaintenanceSchema = new mongoose.Schema({
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    description: { type: String, required: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Qui a signalé le problème
    reportedDate: { type: Date, default: Date.now },
    assignedToTechnician: { type: String }, // Nom ou ID du technicien
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved', 'Cancelled'], default: 'Pending' },
    resolutionDetails: { type: String },
    resolutionDate: { type: Date },
    cost: { type: Number, default: 0 },
    // Autres champs pertinents pour une intervention
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);