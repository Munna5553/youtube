import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});



const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) {
            return null
        }

        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });

        fs.unlinkSync(filePath);

        return response;

    } catch (error) {
        fs.unlinkSync(filePath);
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) {
            return "publicId is missing";
        }

        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Image deleted:', result);

        return result;

    } catch (error) {
        console.error('Error deleting image:', error);
        return error;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary };