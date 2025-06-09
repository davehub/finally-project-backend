const express = require('express');
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, authorizeRoles('admin', 'technician'), getUsers); // Seuls les admins et techniciens peuvent voir la liste des utilisateurs

router.route('/:id')
    .get(protect, authorizeRoles('admin', 'technician'), getUserById) // Seuls les admins et techniciens peuvent voir les détails d'un utilisateur
    .put(protect, authorizeRoles('admin'), updateUser) // Seuls les admins peuvent modifier un utilisateur
    .delete(protect, authorizeRoles('admin'), deleteUser); // Seuls les admins peuvent supprimer un utilisateur

module.exports = router;