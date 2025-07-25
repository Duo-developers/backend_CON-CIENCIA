import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendReminderEmail = async (to, subject, html, text) => {
    const msg = {
        to,
        from: process.env.SENDGRID_SENDER,
        subject,
        text, 
        html, 
    };

    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error("SendGrid error:", error.response?.body || error.message);
        throw new Error("Failed to send reminder email");
    }
};

export const sendPasswordResetEmail = async (to, subject, text, html) => {
    const msg = {
        to,
        from: process.env.SENDGRID_SENDER,
        subject,
        text,
        html
    };

    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error("SendGrid error:", error.response?.body || error.message);
        throw new Error("Failed to send password reset email");
    }
};
