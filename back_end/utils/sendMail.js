const nodemailer = require('nodemailer');

async function sendEmail(userEmail, text) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'localhost',
            service: 'GMAIL',
            port: 3000,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: userEmail,
            subject: 'Account Verification',
            text: text,
        });
        console.log('Email sent successfully!');
    } catch(err) {
        console.log(err);
        console.log('Email not sent!');
    }
}

module.exports = sendEmail;

