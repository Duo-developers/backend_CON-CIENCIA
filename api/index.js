// /api/index.js
import { config } from 'dotenv';
import serverless from 'serverless-http';
import { createApp } from '../config/server.js';

try {
    console.log("[api/index.js] Cargando configuración...");
    config();

    console.log("[api/index.js] Creando app Express...");
    const app = createApp();

    console.log("[api/index.js] Exportando handler...");
    export const handler = serverless(app);
} catch (error) {
    console.error("[api/index.js] Error al iniciar:", error);
}
