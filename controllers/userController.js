const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * Récupère tous les utilisateurs (Admin seulement).
 * Exclut les mots de passe des résultats.
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclure le mot de passe
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

/**
 * Crée un nouvel utilisateur (Admin seulement).
 * Le mot de passe est haché automatiquement par le middleware du modèle.
 */
exports.createUser = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Tous les champs (email, mot de passe, rôle) sont requis.' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet e-mail est déjà utilisé.' });
    }
    const newUser = new User({ email, password, role });
    await newUser.save();
    res.status(201).json({ message: 'Utilisateur ajouté.', user: { id: newUser._id, email: newUser.email, role: newUser.role } });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

/**
 * Met à jour un utilisateur existant par son ID (Admin seulement).
 * Peut changer l'email, le rôle ou le mot de passe.
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, role } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    if (email) user.email = email;
    if (role) user.role = role;
    if (password) {
      // Le hachage sera géré par le middleware pre-save du modèle User
      user.password = password;
    }

    await user.save(); // Sauvegarder les modifications
    res.json({ message: 'Utilisateur mis à jour.', user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

/**
 * Supprime un utilisateur par son ID (Admin seulement).
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};