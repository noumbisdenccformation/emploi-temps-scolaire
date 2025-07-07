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
    return /^[+]?[\d\s\-()]{8,15}$/.test(phone);
  }
}

module.exports = User;