// /api/index.js
import { config } from 'dotenv';
import { createApp } from '../config/server.js';

// Configurar dotenv
config();

// Crear y exportar la app directamente
const app = await createApp();

export default app;
