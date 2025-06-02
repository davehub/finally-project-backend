const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Role = require('../models/Role'); // Pour l'initialisation des rôles par défaut

dotenv.config();

/**
 * Connecte l'application à la base de données MongoDB et initialise les rôles par défaut.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🎉 Connecté à MongoDB avec succès !');
    // Initialiser les rôles par défaut après la connexion réussie
    await initializeDefaultRoles();
  } catch (err) {
    console.error('❌ Échec de la connexion à MongoDB:', err);
    process.exit(1); // Quitter le processus si la connexion échoue
  }
};

/**
 * Initialise les rôles 'admin' et 'user' dans la base de données s'ils n'existent pas déjà.
 */
const initializeDefaultRoles = async () => {
  try {
    const rolesCount = await Role.countDocuments();
    if (rolesCount === 0) {
      console.log('⏳ Aucun rôle trouvé, initialisation des rôles par défaut...');
      await Role.create([
        { name: 'admin', permissions: ['manage_users', 'manage_materials', 'manage_categories', 'manage_roles'] },
        { name: 'user', permissions: ['view_materials', 'view_categories'] }
      ]);
      console.log('✅ Rôles par défaut (admin, user) ajoutés.');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des rôles par défaut:', error);
  }
};

module.exports = connectDB;