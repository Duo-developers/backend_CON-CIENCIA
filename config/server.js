import { dbConnection } from "./mongo.js";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import apiLimiter from "../src/middlewares/rate-limit-validator.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js";
import { createDefaultAdmin } from "../src/utils/defaultUser.js";


const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors({
        origin: 'http://localhost:5173',
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
}

const connectDB = async () => {
    try {
        await dbConnection();
        await createDefaultAdmin(); 
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); 
    }
}

export const initServer = () => {
    const app = express();
    try {
        middlewares(app);
        connectDB();
        routes(app);
        const port = process.env.PORT;
        app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
};
