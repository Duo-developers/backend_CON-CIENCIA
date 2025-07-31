// /api/index.js
import { config } from 'dotenv';
import serverless from 'serverless-http';

// Configurar dotenv antes de importar otros módulos
config();

// Crear el handler
const handler = async (req, res) => {
    try {
        // Importación dinámica para evitar problemas de inicialización
        const { createApp } = await import('../config/server.js');
        const app = createApp();
        
        // Usar serverless-http
        const serverlessHandler = serverless(app);
        return await serverlessHandler(req, res);
    } catch (error) {
        console.error('[api/index.js] Error:', error);
        return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

export default handler;
