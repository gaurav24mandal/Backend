import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

        

    // Configuration
    
    
    // Upload an image
    const fileUpload = async (filePath)=>{
       
        
          try {
            cloudinary.config({ 
                cloud_name: process.env.CLOUD_NAME, 
                api_key: process.env.CLOUD_KEY , 
                api_secret: process.env.CLOUDINARY_SECRET_KEY // Click 'View API Keys' above to copy your API secret
            });
                
           
                   if(!filePath) return null ;
                   const response = await cloudinary.uploader.upload(filePath, {
                       resource_type : "auto"
                     
                   })
                   console.log("file is uploaded on cloudinary ", response.url)
                   fs.unlinkSync(filePath)
                   return response
               } 
               catch (error) {
                    fs.unlinkSync(filePath);
                    console.log(`error in uploading file at cloudnary ${error}`);
                    return null
                }
    } 
export { fileUpload}