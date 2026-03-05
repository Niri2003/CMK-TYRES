const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cmktyres@gmail.com', 
    pass: 'dmwm fobd gkjj cniq' // Your 16-digit App Password
  }
});

const sendUserEmail = async (userEmail, subject, htmlContent) => {
  // Logic: Stop the system from sending to known fake/invalid addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isFake = !userEmail || userEmail.includes('fake.com') || userEmail.includes('test.com');

  if (!emailRegex.test(userEmail) || isFake) {
    console.warn(`⚠️ EMAIL SKIPPED: [${userEmail}] is identified as a fake or invalid address.`);
    return;
  }

  const mailOptions = {
    from: '"CMK Auto Services" <cmktyres@gmail.com>',
    to: userEmail,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <h2 style="color: #0054a6; text-align: center;">CMK AUTO SERVICES</h2>
        <div style="font-size: 15px; color: #333; line-height: 1.6;">
          ${htmlContent}
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 11px; color: #888; text-align: center;">This is an automated update regarding your service booking.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ EMAIL DELIVERED: ${userEmail}`);
  } catch (error) {
    console.error(`❌ MAIL SERVER ERROR for ${userEmail}:`, error.message);
  }
};

module.exports = { sendUserEmail };