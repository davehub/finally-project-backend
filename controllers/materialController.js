const Material = require('../models/Materials');

/**
 * Récupère tous les matériaux.
 */
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error) {
    console.error('Erreur lors de la récupération des matériaux:', error);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

/**
 * Crée un nouveau matériau.
 */
exports.createMaterial = async (req, res) => {
  const { name, category, quantity, unit } = req.body;
  if (!name || !category || quantity === undefined || !unit) {
    return res.status(400).json({ message: 'Tous les champs (nom, catégorie, quantité, unité) sont requis.' });
  }
  try {
    const newMaterial = new Material({ name, category, quantity, unit });
    await newMaterial.save();
    res.status(201).json({ message: 'Matériau ajouté.', material: newMaterial });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du matériau:', error);
    if (error.code === 11000) { // Erreur de clé unique (nom du matériau)
      return res.status(409).json({ message: 'Un matériau avec ce nom existe déjà.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

/**
 * Met à jour un matériau par son ID.
 */
exports.updateMaterial = async (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, unit } = req.body;
  try {
    const updatedMaterial = await Material.findByIdAndUpdate(id, { name, category, quantity, unit }, { new: true, runValidators: true });
    if (!updatedMaterial) {
      return res.status(404).json({ message: 'Matériau non trouvé.' });
    }
    res.json({ message: 'Matériau mis à jour.', material: updatedMaterial });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du matériau:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Un autre matériau avec ce nom existe déjà.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

/**
 * Supprime un matériau par son ID.
 */
exports.deleteMaterial = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Material.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Matériau non trouvé.' });
    }
    res.status(200).json({ message: 'Matériau supprimé.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du matériau:', error);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};