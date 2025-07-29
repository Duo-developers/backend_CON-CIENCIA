export const getResetPasswordEmailTemplate = (resetUrl) => {
    return {
        subject: 'Recuperación de contraseña - CON-CIENCIA',
        text: `Has solicitado restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para establecer una nueva contraseña (válido por 10 minutos): ${resetUrl}\n\nSi no solicitaste este cambio, puedes ignorar este correo y tu contraseña seguirá siendo la misma.`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #2c3e50; text-align: center;">Recuperación de Contraseña</h2>
            <p>Has solicitado restablecer tu contraseña. Por favor, haz clic en el botón de abajo para establecer una nueva contraseña:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer Contraseña</a>
            </div>
            <p style="font-size: 14px; color: #7f8c8d;">Este enlace es válido por 10 minutos.</p>
            <p style="font-size: 14px; color: #7f8c8d;">Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña seguirá siendo la misma.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #95a5a6;">
                &copy; ${new Date().getFullYear()} CON-CIENCIA. Todos los derechos reservados.
            </div>
        </div>
        `
    };
};