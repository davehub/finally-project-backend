const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.get('/', assignmentController.getAllAssignments);
router.get('/:id', assignmentController.getAssignmentById);
router.post('/', assignmentController.createAssignment);
router.put('/:id/return', assignmentController.returnAssignment); // Marquer comme retourné
router.delete('/:id', assignmentController.deleteAssignment);

module.exports = router;