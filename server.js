const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Importer la fonction de connexion à la DB

// Importer les modules de routes
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

dotenv.config(); // Charger les variables d'environnement depuis .env

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à la base de données MongoDB
connectDB();

// Configuration CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Remplacez par l'URL de votre frontend React en développement
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes de gestion des données (protégées par des middlewares)
app.use('/api', dataRoutes);

// Route de test simple
app.get('/', (req, res) => {
  res.send('🎉 Le serveur backend est en cours d\'exécution et prêt !');
});

// Gestionnaire d'erreurs global (à ajouter après toutes les routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Quelque chose s\'est mal passé !');
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
});