import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import apiLimiter from "../src/middlewares/rate-limit-validator.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js";
import articleRoutes from "../src/article/article.routes.js";
import commentRoutes from "../src/comment/comment.routes.js";
import eventRoutes from "../src/event/event.routes.js";
import reminderRoutes from "../src/reminder/reminder.routes.js"; 
import { swaggerDocs } from './swagger.js';
import dbConnection from "./mongo.js"
import { createDefaultEvents, createDefaultArticlesAndComments } from "../src/utils/defaultContent.js"
import { createDefaultUsers } from "../src/utils/defaultUser.js"

const middlewares = (app) => {
    app.set('trust proxy', 1); 
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors({
        origin: ['http://localhost:5173', 'https://frontend-con-ciencia.vercel.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH','OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));
    app.use(helmet());
    app.use(morgan("dev"));
    app.use(apiLimiter);
};

const routes = (app) => {
    app.get("/", (req, res) => {
        res.json({
            message: "CON-CIENCIA API Backend",
            version: "1.0.0",
            status: "Running",
            endpoints: {
                auth: "/conciencia/v1/auth",
                users: "/conciencia/v1/user", 
                articles: "/conciencia/v1/article",
                comments: "/conciencia/v1/comment",
                events: "/conciencia/v1/event",
                reminders: "/conciencia/v1/reminder",
                docs: "/api-docs"
            }
        });
    });

    app.use("/conciencia/v1/auth", authRoutes);
    app.use("/conciencia/v1/user", userRoutes);
    app.use("/conciencia/v1/article", articleRoutes);
    app.use("/conciencia/v1/comment", commentRoutes);
    app.use("/conciencia/v1/event", eventRoutes);
    app.use("/conciencia/v1/reminder", reminderRoutes);
}

const connectDB = async () => {
    try {
        await dbConnection();
        await createDefaultUsers();
        await createDefaultEvents();
        createDefaultArticlesAndComments();
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); 
    }
}

export const createApp = () => {
    const app = express();
    middlewares(app);
    connectDB();
    routes(app);
    swaggerDocs(app);
    return app;
};