// Service email gratuit avec Resend (2000 emails/mois gratuits)
const https = require('https');

const resendService = {
  async sendEmail(to, subject, text) {
    // Clé API Resend (à configurer dans les variables d'environnement)
    const apiKey = process.env.RESEND_API_KEY || 'demo-key';
    
    const emailData = JSON.stringify({
      from: 'noreply@emploi-temps.com',
      to: [to],
      subject: subject,
      text: text
    });

    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': emailData.length
      }
    };

    return new Promise((resolve, reject) => {
      if (apiKey === 'demo-key') {
        // Mode démo - afficher dans les logs
        console.log(`\n=== EMAIL (MODE DÉMO) ===`);
        console.log(`À: ${to}`);
        console.log(`Sujet: ${subject}`);
        console.log(`Message: ${text}`);
        console.log(`========================\n`);
        resolve(true);
        return;
      }

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(true);
          } else {
            reject(new Error(`Email failed: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.write(emailData);
      req.end();
    });
  }
};

module.exports = resendService;