const Category = require('../models/Category');

/**
 * Récupère toutes les catégories.
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

/**
 * Crée une nouvelle catégorie.
 */
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Le nom de la catégorie est requis.' });
  }
  try {
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json({ message: 'Catégorie ajoutée.', category: newCategory });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la catégorie:', error);
    if (error.code === 11000) { // Erreur de clé unique (nom de la catégorie)
      return res.status(409).json({ message: 'Une catégorie avec ce nom existe déjà.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

/**
 * Met à jour une catégorie par son ID.
 */
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, { name, description }, { new: true, runValidators: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Catégorie non trouvée.' });
    }
    res.json({ message: 'Catégorie mise à jour.', category: updatedCategory });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Une autre catégorie avec ce nom existe déjà.' });
    }
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

/**
 * Supprime une catégorie par son ID.
 */
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Category.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Catégorie non trouvée.' });
    }
    res.status(200).json({ message: 'Catégorie supprimée.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};