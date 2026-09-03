import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config()
import fs from 'fs';
    cloudinary.config({ 
        cloud_name: 'sqolui98', 
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
    });
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error('No file path provided');
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("file is uploaded successfully", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        console.log("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath)
        return null;
    }
}
   
export {uploadOnCloudinary}
