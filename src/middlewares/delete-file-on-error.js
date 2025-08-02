import { deleteImageFromCloudinary } from '../../config/cloudinary.js';

/**
 * Middleware para eliminar archivos de Cloudinary cuando ocurre un error
 * en la operación principal. Esto evita archivos huérfanos.
 * 
 * @param {string} publicId - Public ID del archivo a eliminar
 * @returns {Function} - Middleware de Express
 */
export const deleteFileOnError = (publicId) => {
    return async (error, req, res, next) => {
        if (error && publicId) {
            try {
                await deleteImageFromCloudinary(publicId);
                console.log(`🗑️ Archivo eliminado de Cloudinary debido a error: ${publicId}`);
            } catch (deleteError) {
                console.error('Error al eliminar archivo de Cloudinary:', deleteError);
            }
        }
        next(error);
    };
};

/**
 * Función helper para eliminar archivos de Cloudinary de forma segura
 * sin afectar el flujo principal de la aplicación
 * 
 * @param {string} publicId - Public ID del archivo a eliminar
 * @param {string} context - Contexto de la operación (para logging)
 */
export const safeDeleteFile = async (publicId, context = 'unknown') => {
    if (!publicId) {
        return;
    }

    try {
        await deleteImageFromCloudinary(publicId);
        console.log(`🗑️ Archivo eliminado de Cloudinary (${context}): ${publicId}`);
    } catch (error) {
        console.error(`Error al eliminar archivo de Cloudinary (${context}):`, error.message);
        // No lanzamos el error para no afectar el flujo principal
    }
};

export default deleteFileOnError;