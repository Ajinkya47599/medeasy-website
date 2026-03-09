require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

async function testMail() {
    try {
        console.log("Using Host:", process.env.EMAIL_HOST);
        console.log("Using Port:", process.env.EMAIL_PORT);
        console.log("Using User:", process.env.EMAIL_USER);

        await sendEmail({
            email: 'ajinkyasmohite2006@gmail.com',
            subject: 'Test Email Direct',
            message: 'This is a test directly from Node.'
        });
        console.log("Mail sent successfully!");
    } catch (e) {
        console.error("Mail error:", e);
    }
}
testMail();
