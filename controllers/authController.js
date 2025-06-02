const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role'); // Pour vérifier l'existence du rôle

require('dotenv').config();

/**
 * Gère l'inscription d'un nouvel utilisateur.
 * Crée un utilisateur, le hache son mot de passe et génère un token JWT.
 */
exports.register = async (req, res) => {
  const { email, password, role = 'user' } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Veuillez fournir un e-mail et un mot de passe.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet e-mail est déjà utilisé.' });
    }

    const validRole = await Role.findOne({ name: role });
    if (!validRole) {
      return res.status(400).json({ message: `Le rôle '${role}' n'est pas valide ou n'existe pas.` });
    }

    const newUser = new User({ email, password, role });
    await newUser.save(); // Le mot de passe est haché via le middleware pre-save dans le modèle User

    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'Utilisateur enregistré avec succès.',
      token,
      user: { id: newUser._id, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur du serveur lors de l\'inscription.' });
  }
};

/**
 * Gère la connexion d'un utilisateur.
 * Vérifie les informations d'identification et génère un token JWT.
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Veuillez fournir un e-mail et un mot de passe.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'E-mail ou mot de passe invalide.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'E-mail ou mot de passe invalide.' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur du serveur lors de la connexion.' });
  }
};