const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'L\'adresse e-mail est requise.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Veuillez utiliser une adresse e-mail valide.']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis.'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères.']
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'user'],
      message: 'Le rôle doit être "admin" ou "user".'
    },
    default: 'user'
  }
}, { timestamps: true }); // Ajoute createdAt et updatedAt automatiquement

// Hacher le mot de passe avant de sauvegarder l'utilisateur (middleware Mongoose)
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Méthode pour comparer les mots de passe (utilisée lors de la connexion)
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);