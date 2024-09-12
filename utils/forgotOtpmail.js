const nodemailer = require('nodemailer');

// Configure the transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other email services if needed
    auth: {
        user: process.env.PulseCareEmail, // Your PulseCare email address
        pass: process.env.EmailPassword   // Your email password (preferably stored securely in environment variables)
    }
});

// Function to send OTP email for password reset
const sendOtpEmailForgot = async (to, otp, subject) => {
    const mailOptions = {
        from: process.env.PulseCareEmail, // Sender email address
        to, // Recipient email address
        subject: subject, // Email subject
        text: `Your OTP to reset your password is: ${otp}. Please use this OTP to reset your password.`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
                <h2 style="color: #ff4458;">CollegeCrush Password Reset</h2>
                <p style="font-size: 16px;">Hello,</p>
                <p style="font-size: 16px;">We received a request to reset your password for your CollegeCrush account. Please use the One-Time Password (OTP) below to complete the password reset process.</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="font-size: 24px; color: #fe2c73; font-weight: bold;">Your OTP: ${otp}</span>
                </div>
                <p style="font-size: 16px;">If you did not request a password reset, you can safely ignore this email. For any issues, please contact our support team.</p>
                <p style="text-align: center; margin: 20px 0;">
                    <img src="https://cdn.pixabay.com/photo/2018/08/03/04/36/couple-3581038_640.jpg" alt="CollegeCrush" style="width: 100%; max-width: 400px; border-radius: 10px;" />
                </p>
                <p style="font-size: 16px;">Thank you for being part of CollegeCrush. We are here to help you with any issues you might have.</p>
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
    sendOtpEmailForgot
};
