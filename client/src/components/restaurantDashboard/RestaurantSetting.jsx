import React, { useEffect, useState } from "react";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import { RiLoader4Fill } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader";

import CoreDetails from "./settings/coreDetails/Index";
import Information from "./settings/restaurantInformation/Index";
import RestaurantPhotos from "./settings/RestaurantPhotos";

const RestaurantSetting = () => {
  const { user } = useAuth();

  const Tabs = [
    {
      id: "information",
      label: "Information",
    },
    {
      id: "coreDetails",
      label: "Core Details",
    },
    {
      id: "photos",
      label: "Photos",
    },
  ];

  const [activeTab, setActiveTab] = useState("information");

  // Restaurant Open/Close State
  const [isLoadingResturantOpen, setIsLoadingResturantOpen] = useState(false);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(
    () => sessionStorage.getItem("RestaurantOpen") === "true"
  );

  // Restaurant Data
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);

  // Fetch Restaurant Data
  const fetchRestaurantData = async () => {
    try {
      setIsLoadingRestaurant(true);
      setIsLoadingResturantOpen(true);

      const res = await api.get(
        `/restaurant/get-resturant-data?id=${user._id}`
      );

      const data = res.data.data;

      setRestaurantData(data);

      sessionStorage.setItem(
        "cravingRestaurant",
        JSON.stringify(data)
      );

      sessionStorage.setItem(
        "RestaurantOpen",
        data?.isOpen ? "true" : "false"
      );

      setIsRestaurantOpen(!!data?.isOpen);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch restaurant settings. Please try again."
      );
    } finally {
      setIsLoadingRestaurant(false);
      setIsLoadingResturantOpen(false);
    }
  };

  // Change Restaurant Open/Close Status
  const handleRestaurantOpen = async () => {
    try {
      setIsLoadingResturantOpen(true);

      const nextStatus = !isRestaurantOpen;
      const res = await api.patch(
        `/restaurant/change-open-status/${nextStatus}?id=${user._id}`
      );

      const updatedRestaurant = res.data.data;

      setIsRestaurantOpen(updatedRestaurant.isOpen);
      setRestaurantData(updatedRestaurant);

      sessionStorage.setItem(
        "cravingRestaurant",
        JSON.stringify(updatedRestaurant)
      );

      sessionStorage.setItem(
        "RestaurantOpen",
        updatedRestaurant.isOpen ? "true" : "false"
      );

      toast.success(res.data.message || "Store status updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to toggle store availability. Please try again."
      );
    } finally {
      setIsLoadingResturantOpen(false);
    }
  };

  // Load restaurant when user is available
  useEffect(() => {
    if (user?._id) {
      fetchRestaurantData();
    }
  }, [user]);

  return (
    <div className="h-full flex flex-col space-y-4">
      {isLoadingRestaurant ? (
        <Loader height="300px" width="100%" text="Loading restaurant profile..." />
      ) : (
        <>
          {/* Header with Tabs and Store Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
            {/* Tabs */}
            <div className="flex space-x-2">
              {Tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
                    activeTab === tab.id
                      ? "bg-(--color-primary) text-white shadow-md shadow-(--color-primary)/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-(--color-primary)"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Restaurant Open/Close */}
            <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Accepting Orders
              </span>

              {isLoadingResturantOpen ? (
                <RiLoader4Fill className="animate-spin text-(--color-primary)" />
              ) : (
                <input
                  type="checkbox"
                  name="isOpen"
                  checked={isRestaurantOpen}
                  onChange={handleRestaurantOpen}
                  className="w-4 h-4 accent-(--color-primary) cursor-pointer"
                />
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 rounded-2xl bg-(--color-base-100) p-2 overflow-y-auto">
            {activeTab === "information" && (
              <Information
                restaurantData={restaurantData}
                fetchRestaurantData={fetchRestaurantData}
              />
            )}

            {activeTab === "coreDetails" && (
              <CoreDetails
                restaurantData={restaurantData}
                fetchRestaurantData={fetchRestaurantData}
              />
            )}

            {activeTab === "photos" && (
              <RestaurantPhotos
                restaurantData={restaurantData}
                fetchRestaurantData={fetchRestaurantData}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantSetting;