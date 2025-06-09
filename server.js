const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Importation des routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // <-- Assurez-vous que cette ligne n'apparaît qu'UNE SEULE FOIS
const deviceRoutes = require('./routes/deviceRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(express.json()); // Body parser
app.use(cors({
    origin: 'http://localhost:5000' // Autoriser le frontend à s'y connecter
}));

// Utilisation des routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // <-- Assurez-vous que cette ligne n'apparaît qu'UNE SEULE FOIS dans app.use
app.use('/api/devices', deviceRoutes);
app.use('/api/maintenances', maintenanceRoutes);
app.use('/api/emergencies', emergencyRoutes);

// Route de base
app.get('/', (req, res) => {
    res.send('API de Gestion de Parc Informatique est en cours d\'exécution...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Serveur backend démarré sur le port ${PORT}`));