import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { extname } from "path";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const sanitizeFileName = (name) => {
    return name
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "");
};

export const removeCloudinaryUrl = (url) => {
    const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`;
    return url.replace(baseUrl, "");
};

const createMulterUpload = (baseFolder, categoryFolder, useMaterialName = false, maxFileSize = 10 * 1024 * 1024) => {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            const fileExtension = extname(file.originalname);
            const uniqueId = uuidv4().slice(0, 8);
            let fileName = sanitizeFileName(file.originalname.split(fileExtension)[0]);

            if (useMaterialName && req.body.name) {
                fileName = sanitizeFileName(req.body.name);
            }

            const publicId = `${fileName}-${uniqueId}`;
            const isPdf = file.mimetype === "application/pdf";

            return {
                folder: `${baseFolder}/${categoryFolder}`,
                public_id: publicId,
                format: fileExtension.replace(".", ""),
                resource_type: isPdf ? "raw" : "auto"
            };
        },
    });

    const upload = multer({
        storage,
        fileFilter: (req, file, cb) => {
            const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
            if (allowedTypes.includes(file.mimetype)) cb(null, true);
            else cb(new Error("Not allowed file type. Use PNG, JPG, JPEG or PDF."));
        },
        limits: { fileSize: maxFileSize },
    });

    // ✅ Crear middleware que agregue req.img
    const middleware = [
        upload.single("img"),
        (req, res, next) => {
            // Si hay archivo subido, agregar la URL a req.img
            if (req.file && req.file.path) {
                req.img = req.file.path;
            } else {
                // Imagen por defecto si no se sube ninguna
                req.img = "https://res.cloudinary.com/dwc4ynoj9/image/upload/v1750979813/defualtprofile_qiwkss.jpg";
            }
            next();
        }
    ];

    return { single: (field) => middleware };
};

export const uploadUserImg = createMulterUpload("user", "profilePicture", true);



