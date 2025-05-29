const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware d'authentification

// Protéger ces routes, seuls les admins et techniciens peuvent les gérer
// Vous pouvez ajuster les rôles selon vos besoins
router.get('/', authMiddleware.protect, authMiddleware.authorize(['admin', 'technician']), userController.getAllUsers);
router.get('/:id', authMiddleware.protect, authMiddleware.authorize(['admin', 'technician']), userController.getUserById);
router.post('/', authMiddleware.protect, authMiddleware.authorize(['admin', 'technician']), userController.createUser);
router.put('/:id', authMiddleware.protect, authMiddleware.authorize(['admin', 'technician']), userController.updateUser);
router.delete('/:id', authMiddleware.protect, authMiddleware.authorize(['admin']), userController.deleteUser); // Seuls les admins peuvent supprimer

module.exports = router;