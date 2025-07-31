// /api/index.js
import { config } from 'dotenv';
import serverless from 'serverless-http';

// Configurar dotenv
config();

let app;
let appPromise;

const getApp = async () => {
    if (!app && !appPromise) {
        appPromise = (async () => {
            try {
                const { createApp } = await import('../config/server.js');
                const expressApp = await createApp();
                console.log("[api/index.js] App creada exitosamente");
                return expressApp;
            } catch (error) {
                console.error('[api/index.js] Error creando app:', error);
                throw error;
            }
        })();
        app = await appPromise;
    }
    return app;
};

const handler = async (event, context) => {
    try {
        const expressApp = await getApp();
        return await serverless(expressApp)(event, context);
    } catch (error) {
        console.error('[api/index.js] Handler error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal Server Error',
                message: error.message 
            })
        };
    }
};

export default handler;
