const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.protect, assignmentController.getAllAssignments);
router.get('/:id', authMiddleware.protect, assignmentController.getAssignmentById);
router.post('/', authMiddleware.protect, authMiddleware.authorize(['admin', 'technician']), assignmentController.createAssignment);
router.put('/:id/return', authMiddleware.protect, authMiddleware.authorize(['admin', 'technician']), assignmentController.returnAssignment); // Marquer comme retourné
router.delete('/:id', authMiddleware.protect, authMiddleware.authorize(['admin']), assignmentController.deleteAssignment);

module.exports = router;