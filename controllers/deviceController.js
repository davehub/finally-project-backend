const Device = require('../models/Device');

exports.getDevices = async (req, res) => {
    try {
        const devices = await Device.find().populate('assignedTo', 'username email');
        res.json(devices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

exports.getDeviceById = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id).populate('assignedTo', 'username email');
        if (!device) {
            return res.status(404).json({ msg: 'Équipement non trouvé' });
        }
        res.json(device);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

exports.addDevice = async (req, res) => {
    const { name, type, serialNumber, status, assignedTo, location, purchaseDate, warrantyEndDate, description } = req.body;
    try {
        const newDevice = new Device({
            name, type, serialNumber, status, assignedTo, location, purchaseDate, warrantyEndDate, description
        });
        const device = await newDevice.save();
        res.status(201).json(device);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

exports.updateDevice = async (req, res) => {
    const { name, type, serialNumber, status, assignedTo, location, purchaseDate, warrantyEndDate, description } = req.body;
    const deviceFields = { name, type, serialNumber, status, assignedTo, location, purchaseDate, warrantyEndDate, description };

    try {
        let device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ msg: 'Équipement non trouvé' });
        }

        device = await Device.findByIdAndUpdate(
            req.params.id,
            { $set: deviceFields },
            { new: true }
        );
        res.json(device);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};

exports.deleteDevice = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ msg: 'Équipement non trouvé' });
        }
        await Device.findByIdAndDelete(req.params.id); // Utilisation de findByIdAndDelete
        res.json({ msg: 'Équipement supprimé' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
};