const nodemailer = require('nodemailer');

// Configure the transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other email services if needed
    auth: {
        user: process.env.PulseCareEmail, // Your PulseCare email address
        pass: process.env.EmailPassword   // Your email password (preferably stored securely in environment variables)
    }
});

// Function to send OTP email
const sendOtpEmail = async (to, otp, subject) => {
    const mailOptions = {
        from: process.env.PulseCareEmail, // Sender email address
        to, // Recipient email address
        subject: subject, // Email subject
        text: `${subject}: ${otp}. `,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
                <h2 style="color: #ff4458;">Welcome to CollegeCrush!</h2>
                <p style="font-size: 16px;">Hi there,</p>
                <p style="font-size: 16px;">To complete your registration and join the fun on CollegeCrush, please use the One-Time Password (OTP) below to verify your email.</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="font-size: 24px; color: #fe2c73; font-weight: bold;">Your OTP: ${otp}</span>
                </div>
                <p style="font-size: 16px;">Enter this OTP on our website to finalize your registration and start exploring exciting contests, secret posts, and beauty rankings.</p>
                <p style="text-align: center; margin: 20px 0;">
                    <img src="https://cdn.pixabay.com/photo/2018/08/03/04/36/couple-3581038_640.jpg" alt="CollegeCrush" style="width: 100%; max-width: 400px; border-radius: 10px;" />
                </p>
                <p style="font-size: 16px;">Thank you for joining CollegeCrush. We’re thrilled to have you on board!</p>
                <p style="font-size: 16px; color: #777;">Best regards,<br/>The CollegeCrush Team</p>
            </div>
        `,
    };

    // Send the email
    return transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = {
    sendOtpEmail
};
