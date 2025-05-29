const express = require('express');
const router = express.Router();
const softwareController = require('../controllers/softwareController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.protect, softwareController.getAllSoftwares);
router.get('/:id', authMiddleware.protect, softwareController.getSoftwareById);
router.post('/', authMiddleware.protect, authMiddleware.authorize(['admin', 'technician']), softwareController.createSoftware);
router.put('/:id', authMiddleware.protect, authMiddleware.authorize(['admin', 'technician']), softwareController.updateSoftware);
router.delete('/:id', authMiddleware.protect, authMiddleware.authorize(['admin']), softwareController.deleteSoftware);

module.exports = router;