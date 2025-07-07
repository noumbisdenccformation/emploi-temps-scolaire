const User = require('../models/User');
const crypto = require('crypto');

const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

// Charger les utilisateurs existants
let users = [];
try {
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  }
} catch (error) {
  console.log('Fichier utilisateurs non trouvé, création d\'un nouveau');
}

// Sauvegarder les utilisateurs
function saveUsers() {
  try {
    const dir = path.dirname(usersFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Erreur sauvegarde:', error);
  }
}

const authController = {
  async register(req, res) {
    const { email, phone, password, firstName, lastName } = req.body;

    if (!User.isValidEmail(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }
    if (!User.isValidPhone(phone)) {
      return res.status(400).json({ error: 'Téléphone invalide' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Mot de passe trop court' });
    }

    if (users.find(u => u.email === email || u.phone === phone)) {
      return res.status(400).json({ error: 'Email ou téléphone déjà utilisé' });
    }

    const user = new User(email, phone, password, firstName, lastName);
    await user.hashPassword();
    users.push(user);
    saveUsers(); // Sauvegarder

    res.status(201).json({ message: 'Inscription réussie' });
  },

  async login(req, res) {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    res.json({ token, user: { email, firstName: user.firstName } });
  }
};

module.exports = authController;