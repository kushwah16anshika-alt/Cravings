import cloudinary from "../config/cloudinary.config.js";

export const uploadMultipleImages = async (Images, storageLocation) => {
  try {
    const uploadMultiple = Images.map(async (image) => {
      const b64 = Buffer.from(image.buffer).toString("base64");
      const dataURI = `data:${image.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: storageLocation,
        width: 500,
        height: 500,
        crop: "fill",
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    });

    return await Promise.all(uploadMultiple);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const deleteMultipleImages = async (Images) => {
  try {
    if (!Array.isArray(Images) || Images.length === 0) return;

    const validImages = Images.filter(
      (image) => image && typeof image.publicId === "string" && image.publicId.trim() !== ""
    );

    const deleteMultiple = validImages.map(async (image) => {
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (err) {
        console.log(`Failed to delete Cloudinary image ${image.publicId}:`, err.message);
      }
    });

    await Promise.all(deleteMultiple);
  } catch (error) {
    console.log("deleteMultipleImages error:", error.message);
  }
};

export const deleteSingleImage = async (image) => {
  try {
    if (!image || typeof image.publicId !== "string" || image.publicId.trim() === "") {
      return;
    }
    await cloudinary.uploader.destroy(image.publicId);
  } catch (error) {
    console.log("deleteSingleImage error:", error.message);
  }
};

export const UploadSingleImage = async (image, storageLocation) => {
  try {
    const b64 = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: storageLocation,
      width: 500,
      height: 500,
      crop: "fill",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};