const SystemUser = require('../models').SystemUser;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clé secrète pour les tokens JWT (à mettre dans les variables d'environnement en production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

// Enregistrer un nouvel utilisateur du système (par un administrateur)
exports.registerSystemUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        // Vérifier si l'utilisateur existe déjà
        let user = await SystemUser.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return res.status(400).json({ message: 'Le nom d\'utilisateur ou l\'email existe déjà.' });
        }

        // Hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new SystemUser({
            username,
            email,
            password: hashedPassword,
            role: role || 'viewer' // Rôle par défaut si non spécifié
        });

        await user.save();
        res.status(201).json({ message: 'Utilisateur système enregistré avec succès.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Connexion d'un utilisateur du système
exports.loginSystemUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Vérifier si l'utilisateur existe
        const user = await SystemUser.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Identifiants invalides.' });
        }

        // Comparer le mot de passe haché
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Identifiants invalides.' });
        }

        // Générer un token JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };
        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }, // Le token expire après 1 heure
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role });
            }
        );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer tous les utilisateurs du système (pour l'administration)
exports.getAllSystemUsers = async (req, res) => {
    try {
        const users = await SystemUser.find({}).select('-password'); // Ne pas renvoyer le mot de passe haché
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un utilisateur du système (par un administrateur)
exports.updateSystemUser = async (req, res) => {
    const { password, ...otherFields } = req.body;
    const updateData = { ...otherFields };

    try {
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await SystemUser.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'Utilisateur système non trouvé.' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un utilisateur du système (par un administrateur)
exports.deleteSystemUser = async (req, res) => {
    try {
        const deletedUser = await SystemUser.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Utilisateur système non trouvé.' });
        }
        res.status(200).json({ message: 'Utilisateur système supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};