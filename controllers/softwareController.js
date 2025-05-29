const Software = require('../models').Software;

// Récupérer tous les logiciels
exports.getAllSoftwares = async (req, res) => {
    try {
        const softwares = await Software.find({});
        res.status(200).json(softwares);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un logiciel par ID
exports.getSoftwareById = async (req, res) => {
    try {
        const software = await Software.findById(req.params.id);
        if (!software) {
            return res.status(404).json({ message: 'Logiciel non trouvé' });
        }
        res.status(200).json(software);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau logiciel
exports.createSoftware = async (req, res) => {
    const newSoftware = new Software(req.body);
    try {
        const savedSoftware = await newSoftware.save();
        res.status(201).json(savedSoftware);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Mettre à jour un logiciel
exports.updateSoftware = async (req, res) => {
    try {
        const updatedSoftware = await Software.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedSoftware) {
            return res.status(404).json({ message: 'Logiciel non trouvé' });
        }
        res.status(200).json(updatedSoftware);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un logiciel
exports.deleteSoftware = async (req, res) => {
    try {
        const deletedSoftware = await Software.findByIdAndDelete(req.params.id);
        if (!deletedSoftware) {
            return res.status(404).json({ message: 'Logiciel non trouvé' });
        }
        res.status(200).json({ message: 'Logiciel supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};