const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['ordinateur', 'imprimante', 'serveur', 'reseau'] },
  model: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  purchaseDate: { type: Date, required: true },
  warrantyExpiration: { type: Date },
  status: { type: String, enum: ['actif', 'en panne', 'hors service', 'en maintenance'], default: 'actif' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', deviceSchema);