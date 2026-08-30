import cloudinary from "../config/cloudinary.config.js";

export const uploadMultipleImages = async (Images, storageLocation, options = {}) => {
  try {
    if (!Images || !Array.isArray(Images) || Images.length === 0) {
      return [];
    }

    const validImages = Images.filter((img) => img && img.buffer);
    if (validImages.length === 0) return [];

    const uploadPromises = validImages.map(async (image) => {
      const b64 = Buffer.from(image.buffer).toString("base64");
      const dataURI = `data:${image.mimetype || "image/jpeg"};base64,${b64}`;

      const uploadConfig = {
        folder: storageLocation,
        resource_type: "auto",
        ...options,
      };

      const result = await cloudinary.uploader.upload(dataURI, uploadConfig);

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.log("uploadMultipleImages error:", error.message);
    throw error;
  }
};

export const uploadSingleImage = async (image, storageLocation, options = {}) => {
  try {
    if (!image || !image.buffer) {
      return null;
    }

    const b64 = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype || "image/jpeg"};base64,${b64}`;

    const uploadConfig = {
      folder: storageLocation,
      resource_type: "auto",
      ...options,
    };

    const result = await cloudinary.uploader.upload(dataURI, uploadConfig);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.log("uploadSingleImage error:", error.message);
    throw error;
  }
};

export const UploadSingleImage = uploadSingleImage;

export const deleteSingleImage = async (image) => {
  try {
    if (!image) return;
    const publicId = typeof image === "string" ? image : image.publicId;
    if (!publicId || typeof publicId !== "string" || publicId.trim() === "") {
      return;
    }
    await cloudinary.uploader.destroy(publicId.trim());
  } catch (error) {
    console.log("deleteSingleImage error:", error.message);
  }
};

export const deleteMultipleImages = async (Images) => {
  try {
    if (!Array.isArray(Images) || Images.length === 0) return;

    const validImages = Images
      .map((img) => (typeof img === "string" ? img : img?.publicId))
      .filter((id) => id && typeof id === "string" && id.trim() !== "");

    if (validImages.length === 0) return;

    const deletePromises = validImages.map(async (publicId) => {
      try {
        await cloudinary.uploader.destroy(publicId.trim());
      } catch (err) {
        console.log(`Failed to delete Cloudinary image ${publicId}:`, err.message);
      }
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.log("deleteMultipleImages error:", error.message);
  }
};