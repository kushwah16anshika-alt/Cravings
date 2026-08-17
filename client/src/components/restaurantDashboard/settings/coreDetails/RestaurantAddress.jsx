import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import api from "../../../../config/ApiConfig";
import toast from "react-hot-toast";

const RestaurantAddress = () => {
  const [editingRestaurantAddress, setEditingRestaurantAddress] =
    useState(false);

  const [restaurantData, setRestaurantData] = useState(
    JSON.parse(sessionStorage.getItem("cravingRestaurant")) || {},
  );

  const [restaurantAddressFormData, setRestaurantAddressFormData] = useState({
    address: restaurantData?.address || "",
    city: restaurantData?.city || "",
    state: restaurantData?.state || "",
    pinCode: restaurantData?.pinCode || "",
    country: restaurantData?.country || "",
    geoLat: restaurantData?.geoLocation?.lat || "",
    geoLon: restaurantData?.geoLocation?.lon || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const handleRestaurantAddressChange = (e) => {
    const { name, value } = e.target;

    setRestaurantAddressFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setRestaurantAddressFormData((prevData) => ({
          ...prevData,
          geoLat: latitude,
          geoLon: longitude,
        }));

        toast.success("Current location fetched successfully.");
        setIsFetchingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);

        toast.error(
          "Unable to get your current location. Please allow location access.",
        );

        setIsFetchingLocation(false);
      },
    );
  };

  const handleSaveRestaurantAddress = async () => {
    try {
      setIsLoading(true);

      const res = await api.put(
        "/restaurant/update-address",
        restaurantAddressFormData,
      );

      setRestaurantData(res.data.data);

      sessionStorage.setItem(
        "cravingRestaurant",
        JSON.stringify(res.data.data),
      );

      toast.success(
        res.data.message || "Restaurant address updated successfully.",
      );

      setEditingRestaurantAddress(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update address. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRestaurantAddress = () => {
    setRestaurantAddressFormData({
      address: restaurantData?.address || "",
      city: restaurantData?.city || "",
      state: restaurantData?.state || "",
      pinCode: restaurantData?.pinCode || "",
      country: restaurantData?.country || "",
      geoLat: restaurantData?.geoLocation?.lat || "",
      geoLon: restaurantData?.geoLocation?.lon || "",
    });

    setEditingRestaurantAddress(false);
  };

  return (
    <div className="bg-(--color-base-100) rounded-lg p-3">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-(--color-secondary) pb-2 mb-2">
        <h3 className="text-sm font-semibold text-(--color-primary)">
          Address
        </h3>

        {!editingRestaurantAddress ? (
          <button
            onClick={() => setEditingRestaurantAddress(true)}
            className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded text-xs"
          >
            <MdEdit />
            Edit
          </button>
        ) : (
          <div className="flex gap-2 justify-end">
            {/* Get Location */}
            <button
              onClick={handleGetLocation}
              className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded text-xs"
              disabled={isFetchingLocation || isLoading}
            >
              {isFetchingLocation
                ? "Getting Current Location..."
                : "Get Current Location"}
            </button>

            {/* Save */}
            <button
              onClick={handleSaveRestaurantAddress}
              className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded text-xs"
              disabled={isLoading || isFetchingLocation}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>

            {/* Cancel */}
            <button
              onClick={handleCancelRestaurantAddress}
              className="flex items-center gap-2 bg-(--color-secondary) text-(--color-secondary-content) px-2 py-0.5 rounded text-xs"
              disabled={isLoading || isFetchingLocation}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Address Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-center items-center">
        {/* Address */}
        <div className="w-full">
          <label className="text-xs font-semibold">Address</label>

          <input
            type="text"
            name="address"
            value={restaurantAddressFormData.address || ""}
            onChange={handleRestaurantAddressChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurantAddress
                ? "bg-white"
                : "bg-(--color-base-100)"
              } rounded`}
            disabled={!editingRestaurantAddress}
          />
        </div>

        {/* City */}
        <div className="w-full">
          <label className="text-xs font-semibold">City</label>

          <input
            type="text"
            name="city"
            value={restaurantAddressFormData.city || ""}
            onChange={handleRestaurantAddressChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurantAddress
                ? "bg-white"
                : "bg-(--color-base-100)"
              } rounded`}
            disabled={!editingRestaurantAddress}
          />
        </div>

        {/* State */}
        <div className="w-full">
          <label className="text-xs font-semibold">State</label>

          <input
            type="text"
            name="state"
            value={restaurantAddressFormData.state || ""}
            onChange={handleRestaurantAddressChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurantAddress
                ? "bg-white"
                : "bg-(--color-base-100)"
              } rounded`}
            disabled={!editingRestaurantAddress}
          />
        </div>

        {/* Pin Code */}
        <div className="w-full">
          <label className="text-xs font-semibold">Pin Code</label>

          <input
            type="text"
            name="pinCode"
            value={restaurantAddressFormData.pinCode || ""}
            onChange={handleRestaurantAddressChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurantAddress
                ? "bg-white"
                : "bg-(--color-base-100)"
              } rounded`}
            disabled={!editingRestaurantAddress}
          />
        </div>

        {/* Country */}
        <div className="w-full">
          <label className="text-xs font-semibold">Country</label>

          <input
            type="text"
            name="country"
            value={restaurantAddressFormData.country || ""}
            onChange={handleRestaurantAddressChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurantAddress
                ? "bg-white"
                : "bg-(--color-base-100)"
              } rounded`}
            disabled={!editingRestaurantAddress}
          />
        </div>

        {/* Coordinates */}
        <div className="w-full grid grid-cols-2 gap-2">
          {/* Latitude */}
          <div className="w-full">
            <label className="text-xs font-semibold">Latitude</label>

            <input
              type="text"
              name="geoLat"
              value={restaurantAddressFormData.geoLat || ""}
              placeholder="e.g. 28.6139"
              className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurantAddress
                  ? "bg-white"
                  : "bg-(--color-base-100)"
                } rounded`}
              disabled
            />
          </div>

          {/* Longitude */}
          <div className="w-full">
            <label className="text-xs font-semibold">Longitude</label>

            <input
              type="text"
              name="geoLon"
              value={restaurantAddressFormData.geoLon || ""}
              placeholder="e.g. 77.2090"
              className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurantAddress
                  ? "bg-white"
                  : "bg-(--color-base-100)"
                } rounded`}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantAddress;