import { config } from 'dotenv';
import { createApp } from '../config/server.js';

config();

const app = await createApp();

export default app;
