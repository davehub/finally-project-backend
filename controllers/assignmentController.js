const Assignment = require('../models').Assignment;
const User = require('../models').User;
const Equipment = require('../models').Equipment;
const Software = require('../models').Software;

// Récupérer toutes les assignations
exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({})
            .populate('assignedTo', 'firstName lastName email') // Populer l'utilisateur
            .populate('itemId'); // Populer l'équipement ou le logiciel assigné
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une assignation par ID
exports.getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate('assignedTo', 'firstName lastName email')
            .populate('itemId');
        if (!assignment) {
            return res.status(404).json({ message: 'Assignation non trouvée' });
        }
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer une nouvelle assignation
exports.createAssignment = async (req, res) => {
    const { itemType, itemId, assignedTo } = req.body;

    try {
        // Vérifier l'existence de l'utilisateur et de l'élément
        const userExists = await User.findById(assignedTo);
        if (!userExists) {
            return res.status(404).json({ message: 'Utilisateur assigné non trouvé.' });
        }

        let itemExists;
        if (itemType === 'Equipment') {
            itemExists = await Equipment.findById(itemId);
            if (!itemExists) return res.status(404).json({ message: 'Équipement non trouvé.' });
            // Mettre à jour le statut de l'équipement
            await Equipment.findByIdAndUpdate(itemId, { status: 'In Use', assignedTo: assignedTo, assignedDate: new Date() });
        } else if (itemType === 'Software') {
            itemExists = await Software.findById(itemId);
            if (!itemExists) return res.status(404).json({ message: 'Logiciel non trouvé.' });
            // Incrémenter le nombre de licences utilisées
            if (itemExists.usedLicenses >= itemExists.totalLicenses) {
                return res.status(400).json({ message: 'Plus de licences disponibles pour ce logiciel.' });
            }
            await Software.findByIdAndUpdate(itemId, { $inc: { usedLicenses: 1 } });
        } else {
            return res.status(400).json({ message: 'Type d\'élément non valide.' });
        }

        const newAssignment = new Assignment({ itemType, itemId, assignedTo });
        const savedAssignment = await newAssignment.save();
        res.status(201).json(savedAssignment);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Marquer une assignation comme retournée (désassigner)
exports.returnAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignation non trouvée' });
        }

        if (assignment.returnedDate) {
            return res.status(400).json({ message: 'Cette assignation a déjà été retournée.' });
        }

        assignment.returnedDate = new Date();
        const updatedAssignment = await assignment.save();

        // Mettre à jour le statut de l'équipement si c'est un équipement
        if (assignment.itemType === 'Equipment') {
            await Equipment.findByIdAndUpdate(assignment.itemId, { status: 'In Stock', assignedTo: null, assignedDate: null });
        } else if (assignment.itemType === 'Software') {
            await Software.findByIdAndUpdate(assignment.itemId, { $inc: { usedLicenses: -1 } });
        }

        res.status(200).json(updatedAssignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer une assignation (attention: cela pourrait nécessiter de gérer la désassignation de l'équipement/logiciel)
exports.deleteAssignment = async (req, res) => {
    try {
        const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
        if (!deletedAssignment) {
            return res.status(404).json({ message: 'Assignation non trouvée' });
        }
        res.status(200).json({ message: 'Assignation supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};