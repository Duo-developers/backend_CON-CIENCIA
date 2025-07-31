import sgMail from '@sendgrid/mail';

const initSendGrid = () => {
    const key = process.env.SENDGRID_API_KEY;
    if (!key || !key.startsWith("SG.")) {
        console.error("SendGrid: Invalid API key");
        throw new Error("Invalid SendGrid API key");
    }
    sgMail.setApiKey(key);
};

export const sendReminderEmail = async (to, subject, html, text) => {
    initSendGrid(); // ⚠️ aquí se asegura que .env ya esté cargado
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
