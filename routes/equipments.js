const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.protect, equipmentController.getAllEquipments); // Tous les utilisateurs connectés peuvent voir
router.get('/:id', authMiddleware.protect, equipmentController.getEquipmentById);
router.post('/', authMiddleware.protect, authMiddleware.authorize(['admin', 'technician']), equipmentController.createEquipment);
router.put('/:id', authMiddleware.protect, authMiddleware.authorize(['admin', 'technician']), equipmentController.updateEquipment);
router.delete('/:id', authMiddleware.protect, authMiddleware.authorize(['admin']), equipmentController.deleteEquipment);

module.exports = router;