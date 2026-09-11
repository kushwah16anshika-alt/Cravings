import React, { useEffect, useState, useCallback } from "react";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import { RiLoader4Fill } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader";
import {
  MdOutlineInfo,
  MdOutlineLocationOn,
  MdOutlinePhotoLibrary,
} from "react-icons/md";
import { IoSparkles } from "react-icons/io5";

import CoreDetails from "./settings/coreDetails/index";
import Information from "./settings/restaurantInformation/Index";
import RestaurantPhotos from "./settings/RestaurantPhotos";

const RestaurantSetting = () => {
  const { user } = useAuth();

  const Tabs = [
    {
      id: "information",
      label: "Restaurant Profile",
      icon: <MdOutlineInfo size={16} />,
    },
    {
      id: "coreDetails",
      label: "Address & Legal",
      icon: <MdOutlineLocationOn size={16} />,
    },
    {
      id: "photos",
      label: "Photo Gallery",
      icon: <MdOutlinePhotoLibrary size={16} />,
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
  const fetchRestaurantData = useCallback(async () => {
    if (!user?._id) return;
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
  }, [user]);

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

      toast.success(res.data.message || `Store is now ${nextStatus ? "Open" : "Closed"}`);
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
  }, [user?._id, fetchRestaurantData]);

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-0.5 text-xs font-black text-orange-700 mb-1">
            <IoSparkles />
            <span>Store Configuration</span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900">
            Store Profile & Settings
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your kitchen details, campus delivery address, serving hours, and display photos.
          </p>
        </div>

        {/* Accepting Orders Quick Toggle */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Store Status
            </span>
            <span className={`text-xs font-black ${isRestaurantOpen ? "text-emerald-700" : "text-slate-600"}`}>
              {isRestaurantOpen ? "Accepting Orders" : "Closed"}
            </span>
          </div>

          {isLoadingResturantOpen ? (
            <RiLoader4Fill className="animate-spin text-orange-600" size={20} />
          ) : (
            <button
              onClick={handleRestaurantOpen}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isRestaurantOpen ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isRestaurantOpen ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {isLoadingRestaurant ? (
        <Loader height="300px" width="100%" text="Loading restaurant profile..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
            {Tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-2xl transition ${
                    active
                      ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                      : "bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-orange-600 border border-slate-200/60"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="pt-2">
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
        </div>
      )}
    </div>
  );
};

export default RestaurantSetting;