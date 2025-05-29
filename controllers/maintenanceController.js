const Maintenance = require('../models').Maintenance;
const Equipment = require('../models').Equipment;
const User = require('../models').User;

// Récupérer toutes les interventions de maintenance
exports.getAllMaintenances = async (req, res) => {
    try {
        const maintenances = await Maintenance.find({})
            .populate('equipment', 'name serialNumber')
            .populate('reportedBy', 'firstName lastName');
        res.status(200).json(maintenances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une intervention par ID
exports.getMaintenanceById = async (req, res) => {
    try {
        const maintenance = await Maintenance.findById(req.params.id)
            .populate('equipment', 'name serialNumber')
            .populate('reportedBy', 'firstName lastName');
        if (!maintenance) {
            return res.status(404).json({ message: 'Intervention de maintenance non trouvée' });
        }
        res.status(200).json(maintenance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer une nouvelle demande de maintenance
exports.createMaintenance = async (req, res) => {
    const newMaintenance = new Maintenance(req.body);
    try {
        const savedMaintenance = await newMaintenance.save();
        // Mettre à jour le statut de l'équipement si nécessaire (ex: "In Maintenance")
        await Equipment.findByIdAndUpdate(savedMaintenance.equipment, { status: 'In Maintenance' });
        res.status(201).json(savedMaintenance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Mettre à jour une intervention de maintenance
exports.updateMaintenance = async (req, res) => {
    try {
        const updatedMaintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedMaintenance) {
            return res.status(404).json({ message: 'Intervention de maintenance non trouvée' });
        }
        // Si le statut est "Resolved", mettre à jour le statut de l'équipement à "In Use" ou "In Stock"
        if (updatedMaintenance.status === 'Resolved') {
            const equipment = await Equipment.findById(updatedMaintenance.equipment);
            if (equipment) {
                // Si l'équipement était assigné avant la maintenance, le remettre "In Use", sinon "In Stock"
                const newStatus = equipment.assignedTo ? 'In Use' : 'In Stock';
                await Equipment.findByIdAndUpdate(updatedMaintenance.equipment, { status: newStatus });
            }
        }
        res.status(200).json(updatedMaintenance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer une intervention de maintenance
exports.deleteMaintenance = async (req, res) => {
    try {
        const deletedMaintenance = await Maintenance.findByIdAndDelete(req.params.id);
        if (!deletedMaintenance) {
            return res.status(404).json({ message: 'Intervention de maintenance non trouvée' });
        }
        res.status(200).json({ message: 'Intervention de maintenance supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};