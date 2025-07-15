import { promises as fs } from "fs";
import { imageUpload } from "../helpers/cloud-uploads.js";

/**
 * Middleware: sube UNA imagen a Cloudinary y adjunta la URL en req.img
 * @param {string} folder - Carpeta destino en Cloudinary (default: "default")
 */
export const cloudinaryUploadSingle = (folder = "default") => {
    return async (req, res, next) => {
        try {
        const file = req.file;

        if (!file || !file.path) {
            req.img =
            "https://res.cloudinary.com/dwc4ynoj9/image/upload/v1750979813/defualtprofile_qiwkss.jpg";
            return next();
        }

        const { url } = await imageUpload(file, folder);

        fs.unlink(file.path).catch((err) =>
            console.error("Temp file delete error:", err)
        );

        req.img = url;
        return next();
        } catch (err) {
        return next(err); 
        }
    };
};
