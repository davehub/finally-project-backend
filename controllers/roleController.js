const Role = require('../models/Role');

/**
 * Récupère tous les rôles.
 */
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    console.error('Erreur lors de la récupération des rôles:', error);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

/**
 * Crée un nouveau rôle.
 */
exports.createRole = async (req, res) => {
  const { name, permissions } = req.body;
  if (!name || !Array.isArray(permissions)) {
    return res.status(400).json({ message: 'Le nom du rôle et les permissions (tableau) sont requis.' });
  }
  try {
    const newRole = new Role({ name, permissions });
    await newRole.save();
    res.status(201).json({ message: 'Rôle ajouté.', role: newRole });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du rôle:', error);
    if (error.code === 11000) { // Erreur de clé unique (nom du rôle)
      return res.status(409).json({ message: 'Un rôle avec ce nom existe déjà.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

/**
 * Met à jour un rôle par son ID.
 */
exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;
  try {
    const updatedRole = await Role.findByIdAndUpdate(id, { name, permissions }, { new: true, runValidators: true });
    if (!updatedRole) {
      return res.status(404).json({ message: 'Rôle non trouvé.' });
    }
    res.json({ message: 'Rôle mis à jour.', role: updatedRole });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Un autre rôle avec ce nom existe déjà.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

/**
 * Supprime un rôle par son ID.
 */
exports.deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Role.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Rôle non trouvé.' });
    }
    res.status(200).json({ message: 'Rôle supprimé.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du rôle:', error);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};