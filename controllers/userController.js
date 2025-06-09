const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        // Exclure les mots de passe des résultats
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
    const { username, email, role, password } = req.body;

    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'Utilisateur non trouvé' });
        }

        // Mettre à jour les champs si fournis
        if (username) user.username = username;
        if (email) user.email = email;
        if (role) user.role = role;

        // Si un nouveau mot de passe est fourni, le hacher
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json(user);

    } catch (err) {
        console.error(err.message);
        // Gérer les erreurs de validation (ex: email déjà pris)
        if (err.code === 11000) { // Erreur de duplicata MongoDB
            return res.status(400).json({ msg: 'Cet email ou nom d\'utilisateur est déjà utilisé.' });
        }
        res.status(500).send('Erreur Serveur');
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'Utilisateur non trouvé' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Utilisateur supprimé' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

// Note: La fonction `registerUser` est déjà dans authController.js et est utilisée pour créer un nouvel utilisateur.
// Vous pouvez la réutiliser ici si vous voulez que les admins puissent ajouter des utilisateurs via ce contrôleur.
// Pour l'instant, on suppose que `registerUser` est utilisé pour la création.