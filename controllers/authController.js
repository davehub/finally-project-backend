const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Assurez-vous d'avoir bcryptjs

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'L\'utilisateur existe déjà' });
        }
        user = new User({ username, email, password, role });
        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({ _id: user._id, username: user.username, email: user.email, role: user.role, token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Identifiants invalides' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Identifiants invalides' });
        }
        const token = generateToken(user._id);
        res.json({ _id: user._id, username: user.username, email: user.email, role: user.role, token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};