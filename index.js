import { config } from 'dotenv';
import { createApp } from './config/server.js';

config();
createApp();
