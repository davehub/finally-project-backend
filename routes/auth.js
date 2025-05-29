const express = require('express');
const router = express.Router();
const systemUserController = require('../controllers/systemUserController');
const authMiddleware = require('../middlewares/authMiddleware'); // Pour protéger certaines routes d'admin

// Route publique pour l'inscription d'un premier utilisateur (si nécessaire) ou par un admin existant
// En production, l'inscription des SystemUsers devrait être gérée par un admin existant ou une procédure sécurisée.
router.post('/register', authMiddleware.protect, authMiddleware.authorize(['admin']), systemUserController.registerSystemUser);

// Route publique pour la connexion
router.post('/login', systemUserController.loginSystemUser);

// Routes pour la gestion des SystemUsers par un admin
router.get('/users', authMiddleware.protect, authMiddleware.authorize(['admin']), systemUserController.getAllSystemUsers);
router.put('/users/:id', authMiddleware.protect, authMiddleware.authorize(['admin']), systemUserController.updateSystemUser);
router.delete('/users/:id', authMiddleware.protect, authMiddleware.authorize(['admin']), systemUserController.deleteSystemUser);

module.exports = router;