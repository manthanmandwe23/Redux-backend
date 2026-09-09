import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import fs from "fs";
// Configuration
const p = process.env;
const cloudName = p.CLOUDINARY_NAME;
const api_key = p.CLOUDINARY_API_KEY;
const api_secret = p.CLOUDINARY_API_SECRET;

if (!(cloudName && api_key && api_secret)) {
  throw new Error("cloudinary environment variable are missing");
}
cloudinary.config({
  cloud_name: cloudName,
  api_key: api_key,
  api_secret: api_secret, // Click 'View API Keys' above to copy your API secret
});

// Upload an image
const uploadOnCloudinary = async (localfilepath: string) => {
  try {
    if (!localfilepath) {
      return null;
    }
    const uploadResult = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    console.log(
      "file uploaded successfully in cloudinary",
      uploadResult.secure_url,
    );
    //see here fs.unlinksync is synchronus mesans it will wait until deletion happens and then move to next line await fs.promises.unlink(localfilepath); but it is asyncronus
    await fs.promises.unlink(localfilepath);
    return uploadResult;
  } catch (error) {
    //in your catch, you should ideally return null or throw error, because currently the function can return undefined when the upload fails.
    console.log(error);
    try {
      await fs.promises.access(localfilepath);
      await fs.promises.unlink(localfilepath);
    } catch (error) {
      console.log(error);
    }
    return null;
  }
};

export default uploadOnCloudinary;
