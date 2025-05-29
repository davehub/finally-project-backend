// backend/routes/assetRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// Exemple de route pour obtenir la liste des actifs
// Accessible par les admins et les techniciens
router.get('/assets', protect, authorizeRoles('admin', 'technician'), (req, res) => {
  // Simulez la récupération des actifs depuis la base de données
  const assets = [
    { id: '1', name: 'PC Bureau #001', type: 'ordinateur', status: 'actif', assignedTo: 'John Doe' },
    { id: '2', name: 'Imprimante HP Laser', type: 'imprimante', status: 'en panne', assignedTo: 'Bureau R&D' },
  ];
  res.json(assets);
});

// Exemple de route pour ajouter un actif
// Accessible uniquement par les admins
router.post('/assets', protect, authorizeRoles('admin'), (req, res) => {
  const newAsset = req.body;
  // Logique pour ajouter l'actif à la DB
  res.status(201).json({ message: 'Actif ajouté avec succès', asset: newAsset });
});

module.exports = router;