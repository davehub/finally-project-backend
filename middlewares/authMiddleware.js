const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error('Erreur de token:', error);
            res.status(401).json({ msg: 'Non autorisé, token invalide ou expiré' });
        }
    }

    if (!token) {
        res.status(401).json({ msg: 'Non autorisé, pas de token fourni' });
    }
};

// Permet de restreindre l'accès à certaines routes en fonction des rôles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ msg: `Le rôle (${req.user.role || 'non authentifié'}) n'est pas autorisé à accéder à cette ressource` });
        }
        next();
    };
};
// Middleware pour vérifier si l'utilisateur est un administrateur
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ msg: 'Accès refusé, vous devez être administrateur' });
};
// Middleware pour vérifier si l'utilisateur est un technicien
exports.isTechnician = (req, res, next) => {
    if (req.user && req.user.role === 'technicien') {
        return next();
    }
    return res.status(403).json({ msg: 'Accès refusé, vous devez être technicien' });
};
// Middleware pour vérifier si l'utilisateur est un utilisateur standard
exports.isUser = (req, res, next) => {
    if (req.user && req.user.role === 'utilisateur') {
        return next();
    }
    return res.status(403).json({ msg: 'Accès refusé, vous devez être un utilisateur standard' });
};
