import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../config/api.config.js";
import runningLoader from "../../../assets/runningLoader.gif";

const RestaurantInformation = ({
  initialData,
  onSuccess,
  isProfileCreated,
}) => {
  const [isEditing, setIsEditing] = useState(!isProfileCreated);
  const [isLoading, setIsLoading] = useState(false);

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
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        restaurantName: initialData.restaurantName || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pinCode: initialData.pinCode || "",
        country: initialData.country || "",
        description: initialData.description || "",
        restaurantType: initialData.restaurantType || "both",
        cuisineTypes: initialData.cuisineTypes?.join(", ") || "",
        lat: initialData.geoLocation?.lat || "",
        lon: initialData.geoLocation?.lon || "",
      });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [initialData, isProfileCreated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData({
        restaurantName: initialData.restaurantName || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pinCode: initialData.pinCode || "",
        country: initialData.country || "",
        description: initialData.description || "",
        restaurantType: initialData.restaurantType || "both",
        cuisineTypes: initialData.cuisineTypes?.join(", ") || "",
        lat: initialData.geoLocation?.lat || "",
        lon: initialData.geoLocation?.lon || "",
      });
      setIsEditing(false);
    }
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

      formData.cuisineTypes
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c)
        .forEach((c) => {
          payload.append("cuisineTypes", c);
        });

      payload.append("geoLocation.lat", formData.lat);
      payload.append("geoLocation.lon", formData.lon);

      const response = await api.post("/restaurant/update-profile", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message || "Details updated successfully!");
      setIsEditing(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-(--color-base-100) p-6 rounded-2xl shadow-md border border-(--color-base-300)"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold border-b-2 border-(--color-primary) pb-2">
          Basic Details & Location
        </h3>
        {!isEditing && isProfileCreated && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-(--color-primary) text-(--color-primary-content) px-5 py-2 rounded-lg font-bold"
          >
            Edit Profile
          </button>
        )}
      </div>

      <fieldset disabled={!isEditing}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Restaurant Type</label>
            <select
              name="restaurantType"
              value={formData.restaurantType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="veg">Veg</option>
              <option value="non-veg">Non Veg</option>
              <option value="jain">Jain</option>
              <option value="vegan">Vegan</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Cuisine</label>
            <input
              type="text"
              name="cuisineTypes"
              value={formData.cuisineTypes}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="col-span-full">
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="col-span-full">
            <label className="text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {["city", "state", "pinCode", "country"].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium">{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          ))}

          <div>
            <label className="text-sm font-medium">Latitude</label>
            <input
              type="text"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Longitude</label>
            <input
              type="text"
              name="lon"
              value={formData.lon}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      </fieldset>

      {isEditing && (
        <div className="flex justify-end gap-3 mt-6">
          {isProfileCreated && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-(--color-primary) text-(--color-primary-content) px-4 py-2 rounded flex items-center gap-2"
          >
            {isLoading && <img src={runningLoader} className="w-5 h-5" />}
            {isProfileCreated ? "Save Changes" : "Create Profile"}
          </button>
        </div>
      )}
    </form>
  );
};

export default RestaurantInformation;
