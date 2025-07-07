const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'emploi_temps_db',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test de connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à PostgreSQL établie avec succès.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
  }
};

module.exports = { sequelize, testConnection };