import { promises as fs } from "fs";
import { uploadUserImg } from "../../config/cloudinary.js";

/**
 * Middleware: sube UNA imagen a Cloudinary y adjunta la URL en req.img
 * @param {string} folder - Carpeta destino en Cloudinary (default: "default")
 */
export const cloudinaryUploadSingle = (folder = "default") => {
    return async (req, res, next) => {
        const file = req.file; // Obtenemos el archivo subido por multer

        try {
            if (!file || !file.path) {
                req.img =
                    "https://res.cloudinary.com/dwc4ynoj9/image/upload/v1750979813/defualtprofile_qiwkss.jpg";
                return next();
            }

            const { url } = await uploadUserImg(file, folder);

            req.img = url;
            return next();

        } catch (err) {
            console.error("Cloudinary upload failed:", err);
            return next(err);
            
        } finally {
            if (file && file.path) {
                fs.unlink(file.path).catch((unlinkErr) =>
                    console.error("Error deleting temporary file:", unlinkErr)
                );
            }
        }
    };
};