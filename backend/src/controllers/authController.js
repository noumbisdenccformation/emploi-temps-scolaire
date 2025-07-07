const User = require('../models/User');
const UserDB = require('../models/UserDB');
const crypto = require('crypto');

const authController = {
  async register(req, res) {
    try {
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

      // Vérifier unicité
      const existing = await UserDB.findOne({
        where: {
          [require('sequelize').Op.or]: [{ email }, { phone }]
        }
      });
      
      if (existing) {
        return res.status(400).json({ error: 'Email ou téléphone déjà utilisé' });
      }

      // Hasher le mot de passe avant création
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      
      // Créer utilisateur
      const user = await UserDB.create({
        firstName, lastName, email, phone, password: hashedPassword
      });

      res.status(201).json({ message: 'Inscription réussie' });
    } catch (error) {
      console.error('Registration error:', error);
      // Fallback vers stockage fichier si DB indisponible
      if (error.name === 'SequelizeConnectionError') {
        return res.status(503).json({ error: 'Base de données temporairement indisponible' });
      }
      res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserDB.findOne({ where: { email } });
      
      if (!user || !(await user.verifyPassword(password))) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      // Mettre à jour dernière connexion
      user.lastLogin = new Date();
      await user.save();

      const token = crypto.randomBytes(32).toString('hex');
      res.json({ token, user: { email, firstName: user.firstName } });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = authController;