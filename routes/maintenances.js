const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.protect, maintenanceController.getAllMaintenances);
router.get('/:id', authMiddleware.protect, maintenanceController.getMaintenanceById);
router.post('/', authMiddleware.protect, authMiddleware.authorize(['admin', 'technician']), maintenanceController.createMaintenance);
router.put('/:id', authMiddleware.protect, authMiddleware.authorize(['admin', 'technician']), maintenanceController.updateMaintenance);
router.delete('/:id', authMiddleware.protect, authMiddleware.authorize(['admin']), maintenanceController.deleteMaintenance);

module.exports = router;