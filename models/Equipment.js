const mongoose = require('mongoose');
const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Ex: "Ordinateur Portable Dell Latitude"
  type: { type: String, required: true, enum: ['Laptop', 'Desktop', 'Server', 'Printer', 'Monitor', 'Network Device', 'Other'] },
  brand: { type: String },
  model: { type: String },
  serialNumber: { type: String, unique: true, required: true },
  purchaseDate: { type: Date },
  warrantyEndDate: { type: Date },
  status: { type: String, enum: ['In Use', 'In Stock', 'In Maintenance', 'Retired', 'Damaged'], default: 'In Stock' },
  location: { type: String }, // Ex: "Bureau 201", "Stock Serveur"
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Référence à l'utilisateur assigné
  assignedDate: { type: Date },
  specifications: { // Objet pour des specs détaillées (CPU, RAM, HDD, OS, etc.)
      cpu: { type: String },
      ram: { type: String },
      storage: { type: String },
      os: { type: String },
      // ...
  },
  // Autres champs pertinents pour un équipement
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Equipment', EquipmentSchema);