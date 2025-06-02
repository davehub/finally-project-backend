const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du matériau est requis.'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'La catégorie du matériau est requise.'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'La quantité est requise.'],
    min: [0, 'La quantité ne peut pas être négative.']
  },
  unit: {
    type: String,
    required: [true, 'L\'unité est requise.'],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Material', MaterialSchema);