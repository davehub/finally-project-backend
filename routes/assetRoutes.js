// backend/routes/assetRoutes.js
const express = require('express');
const router = express.Router();

// Exemple de route pour obtenir la liste des actifs
// Accessible par tous
router.get('/assets', (req, res) => {
  // Simulez la récupération des actifs depuis la base de données
  const assets = [
    { id: '1', name: 'PC Bureau #001', type: 'ordinateur', status: 'actif', assignedTo: 'John Doe' },
    // Ajoutez d'autres actifs ici
  ];
  res.json(assets);
});

module.exports = router;