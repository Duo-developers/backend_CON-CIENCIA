import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary"; // Importación para la v1 del SDK
import { extname } from "path";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// Configuración correcta y explícita para la v1 del SDK
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
        cloudinary: cloudinary.v2, // Se pasa el objeto cloudinary.v2
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