// En production, l'inscription des SystemUsers devrait être gérée par un admin existant ou une procédure sécurisée.
router.post('/register', systemUserController.registerSystemUser);

// Route publique pour la connexion
router.post('/login', systemUserController.loginSystemUser);

// Routes pour la gestion des SystemUsers
router.get('/users', systemUserController.getAllSystemUsers);
router.put('/users/:id', systemUserController.updateSystemUser);
router.delete('/users/:id', systemUserController.deleteSystemUser);

module.exports = router;