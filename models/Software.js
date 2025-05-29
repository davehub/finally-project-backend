const mongoose = require('mongoose');
const SoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  version: { type: String },
  publisher: { type: String },
  licenseType: { type: String, enum: ['Perpetual', 'Subscription', 'Volume', 'OEM', 'Trial'] },
  licenseKey: { type: String, unique: true },
  purchaseDate: { type: Date },
  expirationDate: { type: Date },
  totalLicenses: { type: Number, default: 1 },
  usedLicenses: { type: Number, default: 0 },
  // Autres champs pertinents pour un logiciel
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Software', SoftwareSchema);