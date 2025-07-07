const crypto = require('crypto');

class User {
  constructor(email, phone, password, firstName = '', lastName = '') {
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdAt = new Date();
  }

  async hashPassword() {
    this.password = crypto.createHash('sha256').update(this.password).digest('hex');
  }

  async verifyPassword(password) {
    const hashedInput = crypto.createHash('sha256').update(password).digest('hex');
    return this.password === hashedInput;
  }

  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static isValidPhone(phone) {
    // Accepter format international avec indicatif pays
    return /^\+\d{1,4}\d{6,14}$/.test(phone.replace(/[\s\-()]/g, ''));
  }
}

module.exports = User;