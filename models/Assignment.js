const mongoose = require('mongoose');
const AssignmentSchema = new mongoose.Schema({
    itemType: { type: String, required: true, enum: ['Equipment', 'Software'] },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'itemType' }, // Polymorphic reference
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedDate: { type: Date, default: Date.now },
    returnedDate: { type: Date },
    notes: { type: String }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);