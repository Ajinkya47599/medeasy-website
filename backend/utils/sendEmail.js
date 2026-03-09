const nodemailer = require('nodemailer');

const sendEmail = async (options, attachmentBuffer = null) => {
    // 1. Create a transporter
    // For demo/testing purposes, you might use Mailtrap or Ethereal, or a real SMTP if env vars exist.
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
        port: process.env.EMAIL_PORT || 2525,
        auth: {
            user: process.env.EMAIL_USER || 'dummy_user',
            pass: process.env.EMAIL_PASS || 'dummy_pass',
        },
    });

    // 2. Define the email options
    const mailOptions = {
        from: `MedEasy Pharmacy <${process.env.EMAIL_FROM || 'noreply@medeasy.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    if (attachmentBuffer) {
        mailOptions.attachments = [
            {
                filename: `Invoice_${options.orderId}.pdf`,
                content: attachmentBuffer,
                contentType: 'application/pdf'
            }
        ];
    }

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
