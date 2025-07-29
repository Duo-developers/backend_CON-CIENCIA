import jwt from "jsonwebtoken"
import User from "../user/user.model.js"

export const validateJWT = async (req, res, next) => {
    try {
        console.log("Headers recibidos:", JSON.stringify(req.headers));
        
        let tokenHeader = req.headers["authorization"] || req.headers["Authorization"];
        let token = null;
        
        if (tokenHeader) {
            console.log("Header de autorización encontrado:", tokenHeader);
            token = tokenHeader.startsWith("Bearer ") ? tokenHeader.substring(7) : tokenHeader;
        } else {
            token = req.body.token || req.query.token;
        }
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided in the request"
            });
        }

        console.log("Token extraído:", token.substring(0, 20) + "...");
        
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        if (!decoded || !decoded.uid) {
            return res.status(401).json({
                success: false,
                message: "Invalid token structure"
            });
        }
        
        console.log("Token verificado, UID:", decoded.uid);
        
        const user = await User.findById(decoded.uid);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist in the database"
            });
        }

        if (user.status === false) {
            return res.status(401).json({
                success: false,
                message: "User was previously deactivated"
            });
        }

        req.usuario = user;
        console.log("Usuario autenticado:", user.username);
        next();
        
    } catch (err) {
        console.error("Error en validateJWT:", err);
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
                error: err.message
            });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired",
                error: err.message
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Error validating token",
                error: err.message || "Unknown error"
            });
        }
    }
}