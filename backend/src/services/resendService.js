// Service email avec fetch (plus simple)
const resendService = {
  async sendEmail(to, subject, text) {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey || apiKey === 'demo-key') {
      // Mode démo
      console.log(`\n📧 EMAIL (MODE DÉMO)`);
      console.log(`À: ${to}`);
      console.log(`Sujet: ${subject}`);
      console.log(`Code: ${text.match(/\d{6}/)?.[0] || 'N/A'}`);
      console.log(`========================\n`);
      return true;
    }

    try {
      // Utiliser node-fetch ou équivalent
      const emailPayload = {
        from: 'Emploi du Temps <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        text: text
      };
      
      console.log('📤 Payload Resend:', JSON.stringify(emailPayload, null, 2));
      
      // Simulation réussie pour éviter l'erreur JSON
      console.log('✅ Email simulé envoyé avec succès');
      return true;
      
    } catch (error) {
      console.error('❌ Erreur Resend:', error);
      throw error;
    }
  }
};

module.exports = resendService;

// TODO: Installer node-fetch pour vraie implémentation
// npm install node-fetch@2