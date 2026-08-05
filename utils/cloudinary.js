import { v2 as cloudinary } from 'cloudinaryl';
import fs from 'fs';
    // Configuration
    cloudinary.config({ 
        cloud_name: 'sqolui98', 
        api_key: '455241831641233', 
        api_secret: 'pwtT-vrsgC3roYG-kUFbF1CrRAE' // 
    });
    
    // Upload an image
     const uploadOnCloudinary = async (localFilePath) =>{
        try{
            if(!localFilePath){
               
                throw new Error('No file path provided');
           }
           const response = await cloudinary.uploader.upload(localFilePath,
            {
                response_type: "auto"
    })
     console.log("file is uploaded successfully" , response.url);
    fs.unlinkSync(localFilePath)
    return response;
}
       // to remove the locally saved  temporary file as the upload 
       catch(error)  {
          fs.unlinkSync(localFilePath)
          return null;
       };
    
    console.log(uploadResult);
     }
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
