// config/server.js
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
import dbConnection from "./mongo.js";
import { validateEnvironment } from "./env-validator.js";
import { createDefaultEvents, createDefaultArticlesAndComments } from "../src/utils/defaultContent.js";
import { createDefaultUsers } from "../src/utils/defaultUser.js";

const middlewares = (app) => {
    console.log("[server.js] Aplicando middlewares...");
    
    app.set('trust proxy', 1); 
    
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors({
        origin: ['http://localhost:5173', 'https://deploy-con-ciencia-59724.web.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH','OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));
    app.use(helmet());
    app.use(morgan("dev"));
    
    app.use(apiLimiter);
};

const routes = (app) => {
    app.use("/conciencia/v1/auth", authRoutes);
    app.use("/conciencia/v1/user", userRoutes);
    app.use("/conciencia/v1/article", articleRoutes);
    app.use("/conciencia/v1/comment", commentRoutes);
    app.use("/conciencia/v1/event", eventRoutes);
    app.use("/conciencia/v1/reminder", reminderRoutes);
};

const connectDB = async () => {
    console.log("[server.js] Conectando a base de datos...");
    try {
        await dbConnection();
        console.log("[server.js] Conexión a MongoDB exitosa");
        
    } catch (error) {
        console.error("[server.js] Error al conectar a la base de datos:", error);
        throw error;
    }
};

export const createApp = async () => {
    console.log("[server.js] Inicializando app Express...");
    
    // Validar variables de entorno críticas
    try {
        validateEnvironment();
    } catch (error) {
        console.error("[server.js] Error en validación de variables de entorno:", error.message);
        process.exit(1);
    }
    
    const app = express();

    middlewares(app);
    
    await connectDB();
    
    routes(app);
    swaggerDocs(app);

    console.log("[server.js] App creada correctamente ✅");
    return app;
};
