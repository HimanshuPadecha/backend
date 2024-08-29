import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:CLOUDINARY_API_KEY,
    api_secret:CLOUDINARY_API_SECRET
})

export const uploadOnCloudinary = async(localpath)=>{
    try {
        if(!localpath) return null
        const response = await cloudinary.uploader.upload(localpath,{resource_type:"auto"})
        console.log("uploaded successfully");
        return response
    } catch (error) {
        fs.unlinkSync(localpath)
        return null
    }
}