const express = require('express');
const router = express.Router();
const softwareController = require('../controllers/softwareController');

router.get('/', softwareController.getAllSoftwares);
router.get('/:id', softwareController.getSoftwareById);
router.post('/', softwareController.createSoftware);
router.put('/:id', softwareController.updateSoftware);
router.delete('/:id', softwareController.deleteSoftware);

module.exports = router;