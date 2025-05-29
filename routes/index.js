const express = require('express');
const router = express.Router();

// Importer les modules de routes
const userRoutes = require('./users');
const equipmentRoutes = require('./equipments');
const softwareRoutes = require('./softwares');
const assignmentRoutes = require('./assignments');
const maintenanceRoutes = require('./maintenances');
const authRoutes = require('./auth');

// Définir les chemins de base pour chaque groupe de routes
router.use('/users', userRoutes);             // /api/users pour les employés du parc
router.use('/equipments', equipmentRoutes);   // /api/equipments
router.use('/softwares', softwareRoutes);     // /api/softwares
router.use('/assignments', assignmentRoutes); // /api/assignments
router.use('/maintenances', maintenanceRoutes); // /api/maintenances
router.use('/auth', authRoutes);             // /api/auth pour l'authentification du système

module.exports = router;