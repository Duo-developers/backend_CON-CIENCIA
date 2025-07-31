import { config } from 'dotenv';
import serverless from 'serverless-http';
import { createApp } from './config/server.js';

config();

const app = createApp();

export const handler = serverless(app);
