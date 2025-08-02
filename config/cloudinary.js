import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import { extname } from "path";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const sanitizeFileName = (name) => {
    return name
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "");
};

const createMulterUpload = (baseFolder, categoryFolder) => {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary.v2, 
        params: (req, file) => {
            const fileExtension = extname(file.originalname);
            const uniqueId = uuidv4().slice(0, 8);
            const fileName = sanitizeFileName(file.originalname.split(fileExtension)[0]);

            return {
                folder: `${baseFolder}/${categoryFolder}`,
                public_id: `${fileName}-${uniqueId}`,
            };
        },
    });

    return multer({
        storage,
        fileFilter: (req, file, cb) => {
            const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error("Tipo de archivo no permitido. Usa PNG, JPG o JPEG."));
            }
        },
        limits: { fileSize: 10 * 1024 * 1024 },
    });
};

export const uploadUserImg = createMulterUpload("user", "profilePicture");

/**
 * Extrae el public ID de una URL de Cloudinary
 * @param {string} cloudinaryUrl - URL completa de Cloudinary
 * @returns {string|null} - Public ID o null si no se puede extraer
 */
export const extractPublicIdFromUrl = (cloudinaryUrl) => {
    if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string') {
        return null;
    }

    try {
        // Patrón para extraer el public ID de URLs de Cloudinary
        // Ejemplo: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image-name-123.jpg
        const urlPattern = /\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z]+)?$/;
        const match = cloudinaryUrl.match(urlPattern);
        
        if (match && match[1]) {
            // Decodificar el public ID (Cloudinary usa encoding especial)
            return decodeURIComponent(match[1]);
        }
        
        return null;
    } catch (error) {
        console.error('Error extracting public ID from URL:', error);
        return null;
    }
};

/**
 * Elimina una imagen de Cloudinary usando su public ID
 * @param {string} publicId - Public ID de la imagen en Cloudinary
 * @returns {Promise<Object>} - Resultado de la eliminación
 */
export const deleteImageFromCloudinary = async (publicId) => {
    if (!publicId) {
        throw new Error('Public ID is required to delete image');
    }

    try {
        const result = await cloudinary.v2.uploader.destroy(publicId);
        
        if (result.result === 'ok' || result.result === 'not found') {
            return {
                success: true,
                message: result.result === 'ok' ? 'Image deleted successfully' : 'Image not found (already deleted)',
                result: result.result
            };
        } else {
            throw new Error(`Failed to delete image: ${result.result}`);
        }
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw new Error(`Failed to delete image: ${error.message}`);
    }
};

/**
 * Elimina una imagen de Cloudinary usando su URL
 * @param {string} imageUrl - URL completa de la imagen en Cloudinary
 * @returns {Promise<Object>} - Resultado de la eliminación
 */
export const deleteImageByUrl = async (imageUrl) => {
    if (!imageUrl) {
        return { success: false, message: 'No image URL provided' };
    }

    try {
        const publicId = extractPublicIdFromUrl(imageUrl);
        
        if (!publicId) {
            return { success: false, message: 'Could not extract public ID from URL' };
        }

        return await deleteImageFromCloudinary(publicId);
    } catch (error) {
        console.error('Error deleting image by URL:', error);
        return { success: false, message: error.message };
    }
};