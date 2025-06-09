const Maintenance = require('../models/Maintenance');
const Device = require('../models/Device');

exports.getMaintenances = async (req, res) => {
    try {
        const maintenances = await Maintenance.find()
            .populate('device', 'name serialNumber')
            .populate('performedBy', 'username');
        res.json(maintenances);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

exports.getMaintenanceById = async (req, res) => {
    try {
        const maintenance = await Maintenance.findById(req.params.id)
            .populate('device', 'name serialNumber')
            .populate('performedBy', 'username');
        if (!maintenance) {
            return res.status(404).json({ msg: 'Maintenance non trouvée' });
        }
        res.json(maintenance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

exports.addMaintenance = async (req, res) => {
    const { device, scheduledDate, completionDate, type, description, performedBy, status, cost, notes } = req.body;
    try {
        const newMaintenance = new Maintenance({
            device, scheduledDate, completionDate, type, description, performedBy, status, cost, notes
        });
        const maintenance = await newMaintenance.save();

        // Optionnel: Mettre à jour la date de dernière maintenance de l'équipement
        if (status === 'terminée' && device) {
            await Device.findByIdAndUpdate(device, { lastMaintenance: completionDate || new Date() });
        }

        res.status(201).json(maintenance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

exports.updateMaintenance = async (req, res) => {
    const { scheduledDate, completionDate, type, description, performedBy, status, cost, notes } = req.body;
    const maintenanceFields = { scheduledDate, completionDate, type, description, performedBy, status, cost, notes };

    try {
        let maintenance = await Maintenance.findById(req.params.id);
        if (!maintenance) {
            return res.status(404).json({ msg: 'Maintenance non trouvée' });
        }

        maintenance = await Maintenance.findByIdAndUpdate(
            req.params.id,
            { $set: maintenanceFields },
            { new: true }
        );

        // Optionnel: Mettre à jour la date de dernière maintenance de l'équipement
        if (maintenance.status === 'terminée' && maintenance.device) {
            await Device.findByIdAndUpdate(maintenance.device, { lastMaintenance: maintenance.completionDate || new Date() });
        }

        res.json(maintenance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

exports.deleteMaintenance = async (req, res) => {
    try {
        const maintenance = await Maintenance.findById(req.params.id);
        if (!maintenance) {
            return res.status(404).json({ msg: 'Maintenance non trouvée' });
        }
        await Maintenance.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Maintenance supprimée' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};