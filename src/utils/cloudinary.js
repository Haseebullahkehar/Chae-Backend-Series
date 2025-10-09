import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image",
            folder: process.env.CLOUDINARY_FOLDER || undefined,
        })
        console.log('file uploaded to cloudinary', response.url)
        // Clean up temp file on success
        try { fs.unlinkSync(localFilePath) } catch {}
        return response;

    } catch (error) {
        console.error('cloudinary upload failed', { path: localFilePath, message: error?.message })
        // remove the locally saved temporary file as the upload operation failed
        try { fs.unlinkSync(localFilePath) } catch {}
        return null;
    }
}

export {uploadOnCloudinary}
