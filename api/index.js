import {config} from "dotenv";
import { createApp } from "../config/server.js";
import { dbConnection } from "../config/mongo.js";
import { createDefaultUsers } from "../src/utils/defaultUser.js";
import { createDefaultEvents, createDefaultArticlesAndComments } from "../src/utils/defaultContent.js";

config();

const initializeDatabase = async () => {
    try {
        await dbConnection();
        await createDefaultUsers();
        await createDefaultEvents();
        await createDefaultArticlesAndComments();
    } catch (error) {
        console.error("Database initialization failed:", error);
    }
};

initializeDatabase();

const app = createApp();

export default app;