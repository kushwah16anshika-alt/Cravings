// import React, { useState, useEffect } from "react";
// import api from "../../config/api.config.js";
// import toast from "react-hot-toast";
// import { RiLoader4Fill } from "react-icons/ri";
// import { useAuth } from "../../context/AuthContext";

// import RestaurantInformation from "./settings/restaurantInformation/Index";
// import CoreDetails from "./settings/coreDetails/index.jsx";
// import RestaurantPhotos from "./settings/RestaurantPhotos";

// import runningLoader from "../../assets/runningLoader.gif";

// const RestaurantProfileContainer = () => {
//   const { user } = useAuth();

//   const tabs = [
//     {
//       id: "information",
//       label: "Information",
//     },
//     {
//       id: "coreDetails",
//       label: "Core Details",
//     },
//     {
//       id: "photos",
//       label: "Photos",
//     },
//   ];

//   const [activeTab, setActiveTab] = useState("information");

//   const [isLoadingResturantOpen, setIsLoadingResturantOpen] = useState(true);

//   const [isRestaurantOpen, setIsRestaurantOpen] = useState(
//     () => sessionStorage.getItem("RestaurantOpen") === "true"
//   );

//   const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(false);
//   const [restaurantData, setRestaurantData] = useState(null);

//   const fetchRestaurantData = async () => {
//     try {
//       setIsLoadingRestaurant(true);
//       setIsLoadingResturantOpen(true);

//       const res = await api.get(`/restaurant/${user._id}`); 

//       setRestaurantData(res.data.data);

//       sessionStorage.setItem(
//         "cravingRestaurant",
//         JSON.stringify(res.data.data)
//       );

//       sessionStorage.setItem(
//         "RestaurantOpen",
//         res.data.data.isOpen
//       );

//       setIsRestaurantOpen(res.data.data.isOpen);
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to fetch restaurant data."
//       );
//     } finally {
//       setIsLoadingRestaurant(false);
//       setIsLoadingResturantOpen(false);
//     }
//   };

//   const handleRestaurantOpen = async () => {
//     try {
//       setIsLoadingResturantOpen(true);

//       const res = await api.patch(
//         `/restaurant/change-open-status/${!isRestaurantOpen}?id=${user._id}`
//       );

//       setRestaurantData(res.data.data);
//       setIsRestaurantOpen(res.data.data.isOpen);

//       sessionStorage.setItem(
//         "cravingRestaurant",
//         JSON.stringify(res.data.data)
//       );

//       sessionStorage.setItem(
//         "RestaurantOpen",
//         res.data.data.isOpen
//       );

//       toast.success(res.data.message);
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to update restaurant status."
//       );
//     } finally {
//       setIsLoadingResturantOpen(false);
//     }
//   };

//   useEffect(() => {
//     if (user?._id) {
//       fetchRestaurantData();
//     }
//   }, [user]);

//  return (
//   <div className="bg-(--color-base-100) rounded-2xl shadow-xl border border-(--color-base-300) h-full flex flex-col min-h-0">
//     {isLoadingRestaurant ? (
//       <div className="flex justify-center items-center h-full py-20">
//         <img
//           src={runningLoader}
//           alt="Loading..."
//           className="w-20 h-20"
//         />
//       </div>
//     ) : (
//       <>
//         {/* Header */}
//         <div className="p-6 border-b border-(--color-base-300) flex justify-between items-center">
//           <div className="flex gap-4">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`px-4 py-2 text-sm font-semibold transition-all ${
//                   activeTab === tab.id
//                     ? "text-(--color-primary) border-b-2 border-(--color-primary)"
//                     : "text-(--color-base-content) opacity-60 hover:opacity-100"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           <div className="flex items-center gap-3">
//             <span className="text-sm font-semibold">Currently Open</span>

//             {isLoadingResturantOpen ? (
//               <RiLoader4Fill className="animate-spin text-lg" />
//             ) : (
//               <input
//                 type="checkbox"
//                 checked={isRestaurantOpen}
//                 onChange={handleRestaurantOpen}
//                 className="w-5 h-5 accent-(--color-primary)"
//               />
//             )}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 min-h-0 overflow-y-auto p-6 bg-(--color-base-200)">
//           {activeTab === "information" && (
//             <RestaurantInformation
//               restaurantData={restaurantData}
//               fetchRestaurantData={fetchRestaurantData}
//             />
//           )}

//           {activeTab === "coreDetails" && (
//             <CoreDetails
//               restaurantData={restaurantData}
//               fetchRestaurantData={fetchRestaurantData}
//             />
//           )}

//           {activeTab === "photos" && (
//             <RestaurantPhotos
//               restaurantData={restaurantData}
//               fetchRestaurantData={fetchRestaurantData}
//             />
//           )}
//         </div>
//       </>
//     )}
//   </div>
// );
// };

// export default RestaurantProfileContainer;



import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import { RiLoader4Fill } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";

import CoreDetails from "./settings/coreDetails/Index";
import Information from "./settings/restaurantInformation/Index";
import RestaurantPhotos from "./settings/RestaurantPhotos";

import Loader from "../../components/Loader";

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
  const [isLoadingResturantOpen, setIsLoadingResturantOpen] =
    useState(true);

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
        data.isOpen
      );

      setIsRestaurantOpen(data.isOpen);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred fetching restaurant. Please try again."
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

      const res = await api.patch(
        `/restaurant/change-open-status/${!isRestaurantOpen}?id=${user._id}`
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
        updatedRestaurant.isOpen
      );

      toast.success(res.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred while opening the restaurant. Please try again."
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
    <>
      <div className="h-full flex flex-col">

        {/* Loading Restaurant */}
        {isLoadingRestaurant ? (
          <Loader height="100%" width="100%" />
        ) : (
          <>
            {/* Tabs Header */}
            <div className="border-b border-(--color-secondary)/50 flex justify-between mb-2 w-full">

              {/* Tabs */}
              <div className="flex gap-3">
                {Tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`p-2 uppercase cursor-pointer ${
                      activeTab === tab.id
                        ? "text-(--color-primary) border-b-3 border-(--color-primary)"
                        : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>

              {/* Restaurant Open/Close */}
              <div className="flex items-center gap-3">

                <label className="w-22 text-xs font-semibold">
                  Currently Open
                </label>

                {isLoadingResturantOpen || isLoadingRestaurant ? (
                  <RiLoader4Fill className="animate-spin" />
                ) : (
                  <input
                    type="checkbox"
                    name="isOpen"
                    checked={isRestaurantOpen}
                    onChange={handleRestaurantOpen}
                    className="w-4 h-4 accent-(--color-primary)"
                  />
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div className="h-full rounded-lg bg-(--color-base-200) p-2">

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
    </>
  );
};

export default RestaurantSetting;