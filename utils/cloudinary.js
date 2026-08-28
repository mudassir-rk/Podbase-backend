import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
    // Configuration
    cloudinary.config({ 
        cloud_name: 'sqolui98', 
        api_key: '455241831641233', 
        api_secret: 'pwtT-vrsgC3roYG-kUFbF1CrRAE' // 
    });
    // Upload an image
//      const uploadOnCloudinary = async (localFilePath) =>{
//         try{
//             if(!localFilePath){
               
//                 throw new Error('No file path provided');
//            }
//            const response = await cloudinary.uploader.upload(localFilePath,
//             {
//                 response_type: "auto"
//     })
//     console.log("file is uploaded successfully" , response.url);
//     fs.unlinkSync(localFilePath)
//     return response;
// }
//        // to remove the locally saved  temporary file as the upload 
//        catch(error)  {
//           fs.unlinkSync(localFilePath)
//           return null;
//        };
//     console.log(uploadResult);
//      }
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