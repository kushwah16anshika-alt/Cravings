import cloudinary from "../config/cloudinary.config.js";

export const uploadMultipleImages = async (Images, storageLocation = "cravings/uploads", options = {}) => {
  try {
    if (!Images) return [];
    const list = Array.isArray(Images) ? Images : [Images];
    const validImages = list.filter((img) => img && (img.buffer || typeof img === "string"));
    if (validImages.length === 0) return [];

    const uploadPromises = validImages.map(async (image) => {
      let dataURI = "";
      if (image.buffer) {
        const b64 = Buffer.from(image.buffer).toString("base64");
        dataURI = `data:${image.mimetype || "image/jpeg"};base64,${b64}`;
      } else if (typeof image === "string") {
        dataURI = image;
      }

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

export const uploadSingleImage = async (image, storageLocation = "cravings/uploads", options = {}) => {
  try {
    if (!image) return null;
    let dataURI = "";
    if (image.buffer) {
      const b64 = Buffer.from(image.buffer).toString("base64");
      dataURI = `data:${image.mimetype || "image/jpeg"};base64,${b64}`;
    } else if (typeof image === "string") {
      dataURI = image;
    } else {
      return null;
    }

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
    let publicId = "";
    if (typeof image === "string") {
      publicId = image;
    } else if (typeof image === "object") {
      publicId = image.publicId || image.public_id || "";
    }
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
    if (!Images) return;
    const list = Array.isArray(Images) ? Images : [Images];
    if (list.length === 0) return;

    const validIds = list
      .map((img) => {
        if (!img) return "";
        if (typeof img === "string") return img.trim();
        return (img.publicId || img.public_id || "").trim();
      })
      .filter((id) => id !== "");

    if (validIds.length === 0) return;

    const deletePromises = validIds.map(async (publicId) => {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log(`Failed to delete Cloudinary image ${publicId}:`, err.message);
      }
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.log("deleteMultipleImages error:", error.message);
  }
};
