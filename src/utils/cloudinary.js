import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_KEY , 
        api_secret: process.env.COULDINARY_SECRET_KEY // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
    const fileUpload = async (filePath)=>{
               try {
                   if(!filePath) return null ;
                   const response = await cloudinary.uploader.upload(filePath, {
                      resource_type : "auto"
                   })
                   fs.unlinkSync(filePath)
                   return response
               } 
               catch (error) {
                    fs.unlinkSync(filePath);
                    console.log(`error in uploading file at cloudnary ${error}`);
                    return null
                }
    } 
export {fileUpload}