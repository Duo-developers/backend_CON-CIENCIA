import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import pkg from "cloudinary"; // ✅ Cambio aquí
import { extname } from "path";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

const { v2: cloudinary } = pkg; // ✅ Extraer v2 del package

console.log("🔧 [cloudinary.js] Iniciando configuración...");

dotenv.config();

// ✅ Logs para verificar variables de entorno
console.log("🔧 [cloudinary.js] Variables de entorno:");
console.log("   CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Definida" : "❌ NO definida");
console.log("   CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ Definida" : "❌ NO definida");
console.log("   CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Definida" : "❌ NO definida");

// ✅ Verificar que cloudinary existe antes de configurar
console.log("🔧 [cloudinary.js] Cloudinary object:", cloudinary);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Verificar que la configuración se aplicó
console.log("🔧 [cloudinary.js] Cloudinary config:", cloudinary.config());
console.log("🔧 [cloudinary.js] Cloudinary uploader:", cloudinary.uploader ? "✅ Disponible" : "❌ NO disponible");

console.log("✅ [cloudinary.js] Cloudinary configurado");

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
    console.log(`🔧 [cloudinary.js] Creando multer upload para: ${baseFolder}/${categoryFolder}`);
    console.log("🔧 [cloudinary.js] Cloudinary en createMulterUpload:", cloudinary);
    
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            console.log("📁 [CloudinaryStorage] Procesando archivo:", file.originalname);
            
            const fileExtension = extname(file.originalname);
            const uniqueId = uuidv4().slice(0, 8);
            let fileName = sanitizeFileName(file.originalname.split(fileExtension)[0]);

            if (useMaterialName && req.body.name) {
                fileName = sanitizeFileName(req.body.name);
            }

            const publicId = `${fileName}-${uniqueId}`;
            const isPdf = file.mimetype === "application/pdf";

            const params = {
                folder: `${baseFolder}/${categoryFolder}`,
                public_id: publicId,
                format: fileExtension.replace(".", ""),
                resource_type: isPdf ? "raw" : "auto"
            };

            console.log("📁 [CloudinaryStorage] Parámetros:", params);
            return params;
        },
    });

    console.log("✅ [cloudinary.js] CloudinaryStorage creado");

    const upload = multer({
        storage,
        fileFilter: (req, file, cb) => {
            console.log("🔍 [multer] Validando archivo:", file.originalname, "Tipo:", file.mimetype);
            
            const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
            if (allowedTypes.includes(file.mimetype)) {
                console.log("✅ [multer] Archivo aceptado");
                cb(null, true);
            } else {
                console.log("❌ [multer] Archivo rechazado");
                cb(new Error("Not allowed file type. Use PNG, JPG, JPEG or PDF."));
            }
        },
        limits: { fileSize: maxFileSize },
    });

    console.log("✅ [cloudinary.js] Multer configurado");

    // ✅ Middleware que agregue req.img
    const middleware = [
        upload.single("img"),
        (req, res, next) => {
            console.log("🔧 [cloudinary middleware] Procesando request...");
            console.log("   req.file:", req.file ? "✅ Presente" : "❌ NO presente");
            
            if (req.file) {
                console.log("   req.file.path:", req.file.path);
                console.log("   req.file.filename:", req.file.filename);
            }
            
            // Si hay archivo subido, agregar la URL a req.img
            if (req.file && req.file.path) {
                req.img = req.file.path;
                console.log("✅ [cloudinary middleware] req.img asignado:", req.img);
            } else {
                // Imagen por defecto si no se sube ninguna
                req.img = "https://res.cloudinary.com/dwc4ynoj9/image/upload/v1750979813/defualtprofile_qiwkss.jpg";
                console.log("⚠️ [cloudinary middleware] Usando imagen por defecto");
            }
            next();
        }
    ];

    console.log("✅ [cloudinary.js] Middleware creado");
    return { single: (field) => middleware };
};

console.log("🔧 [cloudinary.js] Creando uploadUserImg...");
export const uploadUserImg = createMulterUpload("user", "profilePicture", true);
console.log("✅ [cloudinary.js] uploadUserImg creado exitosamente");



