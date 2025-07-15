import cloudinary from "../../config/cloudinary.js";

export const imageUpload = async (file, folder) => {
    try {
        if (!file || !file.path) {
            throw new Error('Please provide a valid file to upload.');
        }

        const { url } = await cloudinary.uploader.upload(file.path, {
            folder: folder,
            use_filename: true,
            unique_filename: false,
        });

        return {url};
    } catch (error) {
        throw new Error("Error al subir la imagen: " + error.message);
    }
};
