const UserDB = require('../models/UserDB');

const adminController = {
  // Récupérer tous les utilisateurs pour prospection
  async getUsers(req, res) {
    try {
      const users = await UserDB.findAll({
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'createdAt', 'lastLogin'],
        order: [['createdAt', 'DESC']]
      });
      
      const stats = {
        total: users.length,
        thisMonth: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length,
        thisWeek: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length
      };

      res.json({ users, stats });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Export CSV pour prospection
  async exportUsers(req, res) {
    try {
      const users = await UserDB.findAll({
        attributes: ['firstName', 'lastName', 'email', 'phone', 'createdAt']
      });

      const csv = [
        'Prénom,Nom,Email,Téléphone,Date inscription',
        ...users.map(u => `${u.firstName},${u.lastName},${u.email},${u.phone},${u.createdAt}`)
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=prospects.csv');
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: 'Erreur export' });
    }
  }
};

module.exports = adminController;