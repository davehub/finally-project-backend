const Equipment = require('../models').Equipment;
const User = require('../models').User; // Pour la référence à l'utilisateur

// Récupérer tous les équipements, avec les utilisateurs assignés si applicable
exports.getAllEquipments = async (req, res) => {
    try {
        const equipments = await Equipment.find({}).populate('assignedTo', 'firstName lastName email'); // Populer l'utilisateur assigné
        res.status(200).json(equipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un équipement par ID
exports.getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id).populate('assignedTo', 'firstName lastName email');
        if (!equipment) {
            return res.status(404).json({ message: 'Équipement non trouvé' });
        }
        res.status(200).json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouvel équipement
exports.createEquipment = async (req, res) => {
    const newEquipment = new Equipment(req.body);
    try {
        const savedEquipment = await newEquipment.save();
        res.status(201).json(savedEquipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Mettre à jour un équipement
exports.updateEquipment = async (req, res) => {
    try {
        const updatedEquipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedEquipment) {
            return res.status(404).json({ message: 'Équipement non trouvé' });
        }
        res.status(200).json(updatedEquipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un équipement
exports.deleteEquipment = async (req, res) => {
    try {
        const deletedEquipment = await Equipment.findByIdAndDelete(req.params.id);
        if (!deletedEquipment) {
            return res.status(404).json({ message: 'Équipement non trouvé' });
        }
        // Il pourrait être judicieux de gérer les assignations liées ici (ex: les désassigner ou les archiver)
        res.status(200).json({ message: 'Équipement supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
