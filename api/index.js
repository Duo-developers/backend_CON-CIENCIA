import {config} from "dotenv";
import { createApp } from "../config/server.js";

config();

// Export the Express app for Vercel serverless functions
export default createApp();