export const getEventReminderTemplate = ({ userName, eventName, eventDate, eventUrl = '#' }) => {
    const subject = `🔔 Recordatorio: ${eventName}`;

    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden; }
            .header { background-color: #005A9C; color: #ffffff; padding: 20px; text-align: center; }
            .header h1 { margin: 0; }
            .content { padding: 30px; color: #333333; line-height: 1.6; }
            .content h2 { color: #005A9C; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { background-color: #3498db; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { background-color: #f4f4f4; color: #888888; text-align: center; padding: 20px; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Recordatorio de Evento</h1>
            </div>
            <div class="content">
                <h2>¡Hola, ${userName}!</h2>
                <p>Este es un recordatorio amistoso para el evento <strong>"${eventName}"</strong>, que está agendado para el día <strong>${eventDate}</strong>.</p>
                <p>¡Esperamos que lo disfrutes!</p>
                <div class="button-container">
                    <a href="${eventUrl}" class="button">Ver Detalles del Evento</a>
                </div>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} CON-CIENCIA. Todos los derechos reservados.
            </div>
        </div>
    </body>
    </html>
    `;

    // Texto plano como alternativa para clientes de correo que no soportan HTML
    const text = `¡Hola, ${userName}! Este es un recordatorio para el evento "${eventName}", agendado para el día ${eventDate}.`;

    return { subject, html, text };
};