/**
 * Validación de variables de entorno críticas
 * Se ejecuta al inicio de la aplicación para asegurar que todas las variables necesarias estén definidas
 */

const requiredEnvVars = [
    'SECRETORPRIVATEKEY',
    'URI_MONGO',
    'SENDGRID_API_KEY',
    'SENDGRID_SENDER',
    'CLOUDINARY_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'FRONTEND_URL'
];

const optionalEnvVars = [
    'DEFAULT_ADMIN_PASSWORD',
    'DEFAULT_TEACHER_PASSWORD',
    'DEFAULT_USER_PASSWORD',
    'PORT'
];

export const validateEnvironment = () => {
    const missingVars = [];
    const warnings = [];

    // Validar variables requeridas
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    });

    // Verificar variables opcionales
    optionalEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            warnings.push(varName);
        }
    });

    // Si faltan variables críticas, lanzar error
    if (missingVars.length > 0) {
        throw new Error(
            `❌ Variables de entorno críticas faltantes:\n${missingVars.join('\n')}\n\n` +
            'Por favor, asegúrate de que estas variables estén definidas en tu archivo .env'
        );
    }

    // Mostrar advertencias para variables opcionales
    if (warnings.length > 0) {
        console.warn('⚠️  Variables de entorno opcionales no definidas:', warnings.join(', '));
    }

    // Validar formato de variables específicas
    validateSpecificVars();

    console.log('✅ Validación de variables de entorno completada');
};

const validateSpecificVars = () => {

    // Validar que URI_MONGO sea una URL válida de MongoDB
    if (process.env.URI_MONGO && !process.env.URI_MONGO.startsWith('mongodb')) {
        throw new Error('❌ URI_MONGO debe ser una URL válida de MongoDB');
    }

    // Validar que FRONTEND_URL sea una URL válida
    if (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.startsWith('http')) {
        throw new Error('❌ FRONTEND_URL debe ser una URL válida');
    }
}; 