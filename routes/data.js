const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Importer tous les contrôleurs de données
const userController = require('../controllers/userController');
const materialController = require('../controllers/materialController');
const categoryController = require('../controllers/categoryController');
const roleController = require('../controllers/roleController');

// Routes de gestion des utilisateurs (Admin seulement)
router.get('/users', authenticateToken, authorizeRoles(['admin']), userController.getAllUsers);
router.post('/users', authenticateToken, authorizeRoles(['admin']), userController.createUser);
router.put('/users/:id', authenticateToken, authorizeRoles(['admin']), userController.updateUser);
router.delete('/users/:id', authenticateToken, authorizeRoles(['admin']), userController.deleteUser);

// Routes de gestion des matériaux (Admin et Utilisateur)
router.get('/materials', authenticateToken, authorizeRoles(['admin', 'user']), materialController.getAllMaterials);
router.post('/materials', authenticateToken, authorizeRoles(['admin']), materialController.createMaterial);
router.put('/materials/:id', authenticateToken, authorizeRoles(['admin']), materialController.updateMaterial);
router.delete('/materials/:id', authenticateToken, authorizeRoles(['admin']), materialController.deleteMaterial);

// Routes de gestion des catégories (Admin et Utilisateur)
router.get('/categories', authenticateToken, authorizeRoles(['admin', 'user']), categoryController.getAllCategories);
router.post('/categories', authenticateToken, authorizeRoles(['admin']), categoryController.createCategory);
router.put('/categories/:id', authenticateToken, authorizeRoles(['admin']), categoryController.updateCategory);
router.delete('/categories/:id', authenticateToken, authorizeRoles(['admin']), categoryController.deleteCategory);

// Routes de gestion des rôles (Admin seulement)
router.get('/roles', authenticateToken, authorizeRoles(['admin']), roleController.getAllRoles);
router.post('/roles', authenticateToken, authorizeRoles(['admin']), roleController.createRole);
router.put('/roles/:id', authenticateToken, authorizeRoles(['admin']), roleController.updateRole);
router.delete('/roles/:id', authenticateToken, authorizeRoles(['admin']), roleController.deleteRole);

module.exports = router;