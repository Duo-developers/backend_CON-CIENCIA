import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana de tiempo
    standardHeaders: true, // Retorna rate limit info en headers `RateLimit-*`
    legacyHeaders: false, // Desactiva headers `X-RateLimit-*`
    
    // Configuración específica para serverless/Vercel
    keyGenerator: (req) => {
        // Intentar obtener la IP real del cliente
        return req.ip || 
                req.connection.remoteAddress || 
                req.socket.remoteAddress ||
                (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
                req.headers['x-real-ip'] ||
                'unknown';
    },
    
    // Configuración para entornos serverless
    skip: (req) => {
        // Skip rate limiting para health checks o requests internos
        return req.url === '/health' || req.url === '/';
    },
    
    // Mensaje personalizado cuando se excede el límite
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: 15 * 60 // 15 minutos en segundos
    }
});

export default apiLimiter;