const crypto = require('crypto');

// Stockage temporaire des codes de vérification
const verificationCodes = new Map();

const emailService = {
  // Générer code de vérification
  generateVerificationCode(email) {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 chiffres
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    verificationCodes.set(email, { code, expires });
    
    // Simulation d'envoi email (remplacer par vraie API email)
    console.log(`Code de vérification pour ${email}: ${code}`);
    
    return code;
  },

  // Vérifier le code
  verifyCode(email, inputCode) {
    const stored = verificationCodes.get(email);
    
    if (!stored) {
      return { valid: false, error: 'Aucun code trouvé' };
    }
    
    if (Date.now() > stored.expires) {
      verificationCodes.delete(email);
      return { valid: false, error: 'Code expiré' };
    }
    
    if (stored.code !== inputCode) {
      return { valid: false, error: 'Code incorrect' };
    }
    
    verificationCodes.delete(email);
    return { valid: true };
  },

  // Validation email basique (gratuite)
  isValidEmailFormat(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'proton.me'];
    
    if (!regex.test(email)) return false;
    
    const domain = email.split('@')[1];
    return commonDomains.includes(domain) || domain.includes('.');
  }
};

module.exports = emailService;