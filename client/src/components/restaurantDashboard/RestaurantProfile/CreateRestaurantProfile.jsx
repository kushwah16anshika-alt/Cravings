import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineAddAPhoto, MdDelete } from "react-icons/md";
import api from "../../../config/ApiConfig";
import runningLoader from "../../../assets/runningLoader.gif";

const MAX_IMAGE_SIZE_BYTES = 5242880;
const MAX_GALLERY_IMAGES = 8;

const CreateRestaurantProfile = ({ onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

  const [restaurantImages, setRestaurantImages] = useState([]);
  const [restaurantImagesPreview, setRestaurantImagesPreview] = useState([]);

  const [formData, setFormData] = useState({
    restaurantName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    description: "",
    restaurantType: "both",
    cuisineTypes: "",
    lat: "",
    lon: "",
    legalName: "",
    companyType: "",
    gstCertificate: "",
    fssaiCertificate: "",
    panCard: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    contactEmail: "",
    contactPhone: "",
    openingTime: "",
    closingTime: "",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return toast.error("Cover image size must be less than 5MB");
      }

      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRestaurantImagesChange = (e) => {
    const files = Array.from(e.target.files);

    if (restaurantImagesPreview.length + files.length > MAX_GALLERY_IMAGES) {
      return toast.error(
        `You can only upload up to ${MAX_GALLERY_IMAGES} gallery images.`,
      );
    }

    const validFiles = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error(`${file.name} is larger than 5MB`);
      } else {
        validFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      }
    });

    setRestaurantImages((prev) => [...prev, ...validFiles]);
    setRestaurantImagesPreview((prev) => [...prev, ...newPreviews]);
  };

  const removeRestaurantImage = (index) => {
    setRestaurantImages((prev) => prev.filter((_, i) => i !== index));

    setRestaurantImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const payload = new FormData();

      payload.append("restaurantName", formData.restaurantName);
      payload.append("address", formData.address);
      payload.append("city", formData.city);
      payload.append("state", formData.state);
      payload.append("pinCode", formData.pinCode);
      payload.append("country", formData.country);
      payload.append("description", formData.description);
      payload.append("restaurantType", formData.restaurantType);

      const cuisines = formData.cuisineTypes
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);

      cuisines.forEach((item) => {
        payload.append("cuisineTypes", item);
      });

      payload.append("geoLocation.lat", formData.lat);
      payload.append("geoLocation.lon", formData.lon);

      payload.append("documents.legalName", formData.legalName);
      payload.append("documents.companyType", formData.companyType);
      payload.append("documents.gstCertificate", formData.gstCertificate);
      payload.append("documents.fssaiCertificate", formData.fssaiCertificate);
      payload.append("documents.panCard", formData.panCard);

      payload.append("financialDetails.bankName", formData.bankName);
      payload.append("financialDetails.accountNumber", formData.accountNumber);
      payload.append("financialDetails.ifscCode", formData.ifscCode);
      payload.append("contactDetails.email", formData.contactEmail);
      payload.append("contactDetails.phone", formData.contactPhone);

      payload.append("servingHours.openingTime", formData.openingTime);
      payload.append("servingHours.closingTime", formData.closingTime);

      const socialMediaLinks = [];

      if (formData.facebookUrl) {
        socialMediaLinks.push({
          platform: "facebook",
          url: formData.facebookUrl,
        });
      }

      if (formData.instagramUrl) {
        socialMediaLinks.push({
          platform: "instagram",
          url: formData.instagramUrl,
        });
      }

      if (formData.twitterUrl) {
        socialMediaLinks.push({
          platform: "twitter",
          url: formData.twitterUrl,
        });
      }

      if (socialMediaLinks.length) {
        payload.append("socialMediaLinks", JSON.stringify(socialMediaLinks));
      }

      if (coverImage) {
        payload.append("coverImage", coverImage);
      }

      restaurantImages.forEach((image) => {
        payload.append("restaurantImage", image);
      });

      const response = await api.post("/restaurant/update-profile", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        },
      });

      toast.success(
        response.data.message || "Restaurant Profile Created Successfully!",
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create profile");
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-10">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-(--color-base-300)">
        <h3 className="text-xl font-bold mb-6">Basic Details & Location</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleChange}
            placeholder="Restaurant Name"
            className="px-3 py-2 border rounded"
            required
          />

          <select
            name="restaurantType"
            value={formData.restaurantType}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
          >
            <option value="veg">Veg</option>
            <option value="non-veg">Non Veg</option>
            <option value="jain">Jain</option>
            <option value="vegan">Vegan</option>
            <option value="both">Both</option>
          </select>

          <input
            type="text"
            name="cuisineTypes"
            value={formData.cuisineTypes}
            onChange={handleChange}
            placeholder="Cuisine"
            className="px-3 py-2 border rounded"
            required
          />

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="px-3 py-2 border rounded"
            required
          />

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="px-3 py-2 border rounded"
            required
          />

          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="px-3 py-2 border rounded"
            required
          />

          <input
            type="text"
            name="pinCode"
            value={formData.pinCode}
            onChange={handleChange}
            placeholder="Pin Code"
            className="px-3 py-2 border rounded"
            required
          />

          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className="px-3 py-2 border rounded"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="px-3 py-2 border rounded md:col-span-2"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-(--color-base-300)">
        <h3 className="text-xl font-bold mb-6">Restaurant Photos</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Cover Image</label>

            <label className="h-60 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer overflow-hidden">
              {coverImagePreview ? (
                <img
                  src={coverImagePreview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <MdOutlineAddAPhoto className="text-5xl" />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label>Gallery Images</label>

              <label className="cursor-pointer text-(--color-primary)">
                Add Image
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleRestaurantImagesChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {restaurantImagesPreview.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    className="w-full h-24 object-cover rounded"
                  />

                  <button
                    type="button"
                    onClick={() => removeRestaurantImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-(--color-base-300)">
        <h3 className="text-xl font-bold mb-6">Documents & Legal</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="legalName"
            value={formData.legalName}
            onChange={handleChange}
            placeholder="Legal Name"
            className="px-3 py-2 border rounded"
          />

          <input
            name="companyType"
            value={formData.companyType}
            onChange={handleChange}
            placeholder="Company Type"
            className="px-3 py-2 border rounded"
          />

          <input
            name="gstCertificate"
            value={formData.gstCertificate}
            onChange={handleChange}
            placeholder="GST Certificate"
            className="px-3 py-2 border rounded"
          />

          <input
            name="fssaiCertificate"
            value={formData.fssaiCertificate}
            onChange={handleChange}
            placeholder="FSSAI Certificate"
            className="px-3 py-2 border rounded"
          />

          <input
            name="panCard"
            value={formData.panCard}
            onChange={handleChange}
            placeholder="PAN Card"
            className="px-3 py-2 border rounded"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-(--color-base-300)">
        <h3 className="text-xl font-bold mb-6">Financial Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="Bank Name"
            className="px-3 py-2 border rounded"
          />

          <input
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Account Number"
            className="px-3 py-2 border rounded"
          />

          <input
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            placeholder="IFSC Code"
            className="px-3 py-2 border rounded"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-(--color-base-300)">
        <h3 className="text-xl font-bold mb-6">Contact & Hours</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="Email"
            className="px-3 py-2 border rounded"
          />

          <input
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="Phone"
            className="px-3 py-2 border rounded"
          />

          <input
            type="time"
            name="openingTime"
            value={formData.openingTime}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
          />

          <input
            type="time"
            name="closingTime"
            value={formData.closingTime}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 px-5 py-2 rounded"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-(--color-primary) text-(--color-primary-content) px-5 py-2 rounded flex items-center gap-2"
        >
          {isLoading && <img src={runningLoader} className="w-5 h-5" />}

          {isLoading ? `Adding ${uploadProgress}%` : "Add Restaurant"}
        </button>
      </div>
    </form>
  );
};

export default CreateRestaurantProfile;
