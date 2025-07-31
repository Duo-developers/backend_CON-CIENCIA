import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import { extname } from "path";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

cloudinary.v2.config({
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
    return url.replace(process.env.CLOUDINARY_URL, "");
};

const createMulterUpload = (baseFolder, categoryFolder, useMaterialName = false, maxFileSize = 10 * 1024 * 1024) => {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary.v2,
        params: async (req, file) => {
            const fileExtension = extname(file.originalname);
            const uniqueId = uuidv4().slice(0, 8);
            let fileName = sanitizeFileName(file.originalname.split(fileExtension)[0]);

            if (useMaterialName && req.body.name) {
                fileName = sanitizeFileName(req.body.name);
            }

            const publicId = `${fileName}-${uniqueId}`;
            const relativePath = `${baseFolder}/${categoryFolder}/${publicId}.${fileExtension.replace(".", "")}`;

            if (!req.tempImagePublicIds) req.tempImagePublicIds = [];
            req.tempImagePublicIds.push(relativePath);

            const isPdf = file.mimetype === "application/pdf";

            return {
                folder: `${baseFolder}/${categoryFolder}`,
                public_id: publicId,
                format: fileExtension.replace(".", ""),
                resource_type: isPdf ? "raw" : "auto"
            };
        },
    });

    return multer({
        storage,
        fileFilter: (req, file, cb) => {
            const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
            if (allowedTypes.includes(file.mimetype)) cb(null, true);
            else cb(new Error("Not allowed file type. Use PNG, JPG, JPEG or PDF."));
        },
        limits: { fileSize: maxFileSize },
    });
};

export const uploadUserImg = createMulterUpload("user", "profilePicture", true);



