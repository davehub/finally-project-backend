const express = require('express');
const { getDevices, getDeviceById, addDevice, updateDevice, deleteDevice } = require('../controllers/deviceController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getDevices)
    .post(protect, authorizeRoles('admin', 'technician'), addDevice); // Admins et Techniciens peuvent ajouter

router.route('/:id')
    .get(protect, getDeviceById)
    .put(protect, authorizeRoles('admin', 'technician'), updateDevice) // Admins et Techniciens peuvent modifier
    .delete(protect, authorizeRoles('admin'), deleteDevice); // Seuls les admins peuvent supprimer

module.exports = router;