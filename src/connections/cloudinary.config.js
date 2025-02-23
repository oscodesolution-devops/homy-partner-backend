import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';

dotenv.config();

console.log("ENV CHECK:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary environment variables are missing!");
}

const uploadToCloudinary = async (imageData, folder) => {
    try {
        // Check if the input is a base64 string
        if (typeof imageData === 'string' && imageData.startsWith('data:')) {
            // Upload base64 data directly
            const result = await cloudinary.uploader.upload(imageData, {
                folder: folder,
                resource_type: "auto"
            });
            return result.secure_url;
        } else {
            // Handle file path upload (existing functionality)
            const result = await cloudinary.uploader.upload(imageData, {
                folder: folder
            });
            return result.secure_url;
        }
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("File upload failed.");
    }
};

export default uploadToCloudinary;
