import { v2 as cloudinary } from "cloudinary";
import ApiError from "./ApiError.js";
const deleteCloudinaryImages = async (public_id: string) => {
  try {
    if (!public_id) {
      throw new ApiError(
        400,
        "publicid is required to delete image from cloudinary",
      );
    }
    const deleted = await cloudinary.uploader.destroy(public_id);
    return deleted;
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(500, `cloudinary delete error: ${error.message}`);
    }
    throw new ApiError(500, "cloudinary delete error");
  }
};
export { deleteCloudinaryImages };
