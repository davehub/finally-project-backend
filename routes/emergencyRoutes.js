const express = require('express');
const { getEmergencies, getEmergencyById, addEmergency, updateEmergency, deleteEmergency } = require('../controllers/emergencyController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, authorizeRoles('admin', 'technician', 'user', 'viewer'), getEmergencies) // Tous peuvent voir les urgences (si la leur)
    .post(protect, addEmergency); // Tout utilisateur authentifié peut signaler une urgence

router.route('/:id')
    .get(protect, authorizeRoles('admin', 'technician', 'user', 'viewer'), getEmergencyById)
    .put(protect, authorizeRoles('admin', 'technician'), updateEmergency) // Seuls admins/techniciens peuvent mettre à jour
    .delete(protect, authorizeRoles('admin'), deleteEmergency);

module.exports = router;