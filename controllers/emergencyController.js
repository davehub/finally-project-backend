const Emergency = require('../models/Emergency');
const Device = require('../models/Device');

exports.getEmergencies = async (req, res) => {
    try {
        const emergencies = await Emergency.find()
            .populate('device', 'name serialNumber status')
            .populate('reportedBy', 'username email')
            .populate('resolvedBy', 'username');
        res.json(emergencies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

exports.getEmergencyById = async (req, res) => {
    try {
        const emergency = await Emergency.findById(req.params.id)
            .populate('device', 'name serialNumber status')
            .populate('reportedBy', 'username email')
            .populate('resolvedBy', 'username');
        if (!emergency) {
            return res.status(404).json({ msg: 'Urgence non trouvée' });
        }
        res.json(emergency);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

exports.addEmergency = async (req, res) => {
    const { device, reportedBy, issue, priority, status } = req.body;
    try {
        const newEmergency = new Emergency({
            device, reportedBy, issue, priority, status
        });
        const emergency = await newEmergency.save();

        // Optionnel: Mettre à jour le statut de l'équipement si l'urgence est "nouvelle" ou "en cours"
        if (emergency.status === 'nouvelle' || emergency.status === 'en cours') {
            await Device.findByIdAndUpdate(device, { status: 'en panne' }); // Ou un autre statut approprié
        }

        res.status(201).json(emergency);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

exports.updateEmergency = async (req, res) => {
    const { issue, priority, status, resolutionDetails, resolvedBy, resolutionDate } = req.body;
    const emergencyFields = { issue, priority, status, resolutionDetails, resolvedBy, resolutionDate };

    try {
        let emergency = await Emergency.findById(req.params.id);
        if (!emergency) {
            return res.status(404).json({ msg: 'Urgence non trouvée' });
        }

        emergency = await Emergency.findByIdAndUpdate(
            req.params.id,
            { $set: emergencyFields },
            { new: true }
        );

        // Optionnel: Mettre à jour le statut de l'équipement si l'urgence est résolue
        if (emergency.status === 'résolue' && emergency.device) {
            await Device.findByIdAndUpdate(emergency.device, { status: 'actif' }); // Ou un autre statut
        }

        res.json(emergency);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

exports.deleteEmergency = async (req, res) => {
    try {
        const emergency = await Emergency.findById(req.params.id);
        if (!emergency) {
            return res.status(404).json({ msg: 'Urgence non trouvée' });
        }
        await Emergency.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Urgence supprimée' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};