//

import React, { useState } from "react";
import RestaurantInformation from "./RestaurantProfile/RestaurantInformation";
import RestaurantCoreDetails from "./RestaurantProfile/ContactAndHours.jsx";
import RestaurantPhotos from "./RestaurantProfile/RestaurantPhotos.jsx";

const RestaurantProfileContainer = () => {
  const tabs = [
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
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);

  return (
    <div className="bg-(--color-base-100) rounded-2xl shadow-xl border border-(--color-base-300) overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-(--color-base-300) flex justify-between items-center">
        {/* Tabs */}
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold transition-all
              ${
                activeTab === tab.id
                  ? "text-(--color-primary) border-b-2 border-(--color-primary)"
                  : "text-(--color-base-content) opacity-60 hover:opacity-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Restaurant Status */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">Currently Open</span>

          <input
            type="checkbox"
            checked={isRestaurantOpen}
            onChange={() => setIsRestaurantOpen(!isRestaurantOpen)}
            className="w-5 h-5 accent-(--color-primary)"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-(--color-base-200)">
        {activeTab === "information" && <RestaurantInformation />}

        {activeTab === "coreDetails" && <RestaurantCoreDetails />}

        {activeTab === "photos" && <RestaurantPhotos />}
      </div>
    </div>
  );
};

export default RestaurantProfileContainer;
