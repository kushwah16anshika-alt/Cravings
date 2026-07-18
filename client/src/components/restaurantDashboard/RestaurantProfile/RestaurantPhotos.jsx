import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineAddAPhoto, MdDelete, MdEdit } from "react-icons/md";
import api from "../../../config/ApiConfig";

const MAX_IMAGE_SIZE_BYTES = 5242880;
const MAX_GALLERY_IMAGES = 8;

const RestaurantPhotos = ({ initialData, onSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(
    initialData?.coverImage?.url || null,
  );

  const [restaurantImages, setRestaurantImages] = useState([]);

  const [existingImagesToKeep, setExistingImagesToKeep] = useState(
    initialData?.restaurantImage || [],
  );

  const [restaurantImagesPreview, setRestaurantImagesPreview] = useState(
    initialData?.restaurantImage?.map((img) => img.url) || [],
  );

  useEffect(() => {
    setCoverImagePreview(initialData?.coverImage?.url || null);

    setExistingImagesToKeep(initialData?.restaurantImage || []);

    setRestaurantImagesPreview(
      initialData?.restaurantImage?.map((img) => img.url) || [],
    );
  }, [initialData]);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error("Image size must be less than 5MB");

      return;
    }

    setCoverImage(file);

    setCoverImagePreview(URL.createObjectURL(file));
  };

  const handleRestaurantImagesChange = (e) => {
    const files = Array.from(e.target.files);

    if (restaurantImagesPreview.length + files.length > MAX_GALLERY_IMAGES) {
      toast.error(`Maximum ${MAX_GALLERY_IMAGES} images allowed`);

      return;
    }

    const validFiles = [];
    const previews = [];

    files.forEach((file) => {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error(`${file.name} is larger than 5MB`);
      } else {
        validFiles.push(file);

        previews.push(URL.createObjectURL(file));
      }
    });

    setRestaurantImages((prev) => [...prev, ...validFiles]);

    setRestaurantImagesPreview((prev) => [...prev, ...previews]);
  };

  const removeRestaurantImage = (index) => {
    if (index < existingImagesToKeep.length) {
      setExistingImagesToKeep((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingImagesToKeep.length;

      setRestaurantImages((prev) => prev.filter((_, i) => i !== newIndex));
    }

    setRestaurantImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setCoverImage(null);

    setRestaurantImages([]);

    setCoverImagePreview(initialData?.coverImage?.url || null);

    setExistingImagesToKeep(initialData?.restaurantImage || []);

    setRestaurantImagesPreview(
      initialData?.restaurantImage?.map((img) => img.url) || [],
    );

    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const payload = new FormData();

      if (coverImage) {
        payload.append("coverImage", coverImage);
      }

      restaurantImages.forEach((image) => {
        payload.append("restaurantImage", image);
      });

      payload.append(
        "existingRestaurantImages",
        JSON.stringify(existingImagesToKeep),
      );

      const response = await api.post("/restaurant/update-profile", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message || "Images updated successfully");

      setIsEditing(false);

      setCoverImage(null);

      setRestaurantImages([]);

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload images");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-(--color-primary) p-5 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MdOutlineAddAPhoto />
            Restaurant Photos
          </h2>

          <p>Manage restaurant images</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-white text-(--color-primary) px-5 py-2 rounded-lg font-bold flex items-center gap-2"
          >
            <MdEdit />
            Edit
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="border px-5 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-white text-(--color-primary) px-5 py-2 rounded-lg font-bold"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold mb-3">Cover Image</h3>

          <div className="h-72 border-2 border-dashed rounded-xl overflow-hidden relative">
            {coverImagePreview ? (
              <img
                src={coverImagePreview}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}

            {isEditing && (
              <label className="absolute inset-0 bg-black/50 text-white flex items-center justify-center cursor-pointer">
                Upload Cover
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-3">
            <h3 className="font-bold">Gallery Images</h3>

            {isEditing && (
              <label className="bg-(--color-primary) text-white px-4 py-2 rounded-lg cursor-pointer">
                Add
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleRestaurantImagesChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {restaurantImagesPreview.map((img, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden"
              >
                <img src={img} className="w-full h-full object-cover" />

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeRestaurantImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <MdDelete />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPhotos;
