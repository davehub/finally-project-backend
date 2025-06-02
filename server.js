// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes'); // Importez les routes d'actifs

dotenv.config();

connectDB(); // Connexion à la base de données

const app = express();

app.use(express.json()); // Permet de parser le corps des requêtes en JSON
app.use(cors()); // Active CORS pour toutes les requêtes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes); // Utilisez les routes d'actifs

app.use((req, res) => {
  res.send("API is running..." );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});