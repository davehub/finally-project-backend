const express = require('express');
const { getMaintenances, getMaintenanceById, addMaintenance, updateMaintenance, deleteMaintenance } = require('../controllers/maintenanceController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, authorizeRoles('admin', 'technician', 'viewer'), getMaintenances) // Tous peuvent voir, techniciens et admins gèrent
    .post(protect, authorizeRoles('admin', 'technician'), addMaintenance);

router.route('/:id')
    .get(protect, authorizeRoles('admin', 'technician', 'viewer'), getMaintenanceById)
    .put(protect, authorizeRoles('admin', 'technician'), updateMaintenance)
    .delete(protect, authorizeRoles('admin'), deleteMaintenance);

module.exports = router;