const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Pour vérifier l'existence de l'utilisateur

require('dotenv').config();

/**
 * Middleware pour vérifier la validité du token JWT dans l'en-tête Authorization.
 * Attache les informations de l'utilisateur (id, email, role) à `req.user`.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Erreur de vérification du token:', err.message);
      return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }
    req.user = user; // Attacher les informations de l'utilisateur (id, email, role) décodées du token
    next();
  });
};

/**
 * Middleware pour vérifier si l'utilisateur authentifié possède l'un des rôles autorisés.
 * @param {Array<string>} allowedRoles - Tableau de chaînes de caractères des rôles autorisés (ex: ['admin', 'user']).
 */
const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Accès refusé. Rôle utilisateur non défini ou utilisateur non authentifié.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé. Permissions insuffisantes pour cette action.' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};