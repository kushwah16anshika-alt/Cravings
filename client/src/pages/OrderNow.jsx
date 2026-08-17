// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../config/api.config";
// import toast from "react-hot-toast";
// import Loader from "../assets/runningLoader.gif";
// import NoDataFound from "../components/NoDataFound";
// import defaultRestaurantImage from "../assets/Samplerestaurant.jpg";

// const OrderNow = () => {
//   const navigate = useNavigate();
//   const [restaurants, setRestaurants] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
// //   const [selectedRestaurant, setSelectedRestaurant] = useState(null);

//   const fetchRestaurants = async () => {
//     try {
//       setIsLoading(true);
//       const response = await api.get("/public/restaurants");
//       setRestaurants(response.data.data);
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Unknown error occurred during fetching restaurants. Please try again.",
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRestaurant = (restaurant) => {
//     navigate(`/restaurant-details/${restaurant._id}`);
//   };

//   useEffect(() => {
//     fetchRestaurants();
//   }, []);

//   if (isLoading) {
//     return <Loader height="100vh" width="100%" />;
//   }

//   return (
//     <>
//       <header>
//         <div className="py-6">
//           <h1 className="text-3xl font-bold text-(--color-primary) mb-2 text-center">
//             Order From your Favorite Restaurants{" "}
//           </h1>
//         </div>
//       </header>
//       <div className="p-4 w-7xl mx-auto">
//         {restaurants.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {restaurants.map((restaurant) => (
//               <div
//                 key={restaurant.id}
//                 className="border border-(--color-base-300) rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
//                 onClick={() => {
//                   handleRestaurant(restaurant);
//                 }}
//               >
//                 <div className="w-full h-48">
//                   <img
//                     src={restaurant?.coverImage?.url || defaultRestaurantImage}
//                     alt={restaurant.restaurantName}
//                     className="w-full h-full object-cover rounded-t-xl"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h2 className="text-lg font-bold">
//                     {restaurant.restaurantName}
//                   </h2>
//                   <p>{restaurant.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <NoDataFound
//             height="100vh"
//             width="100%"
//             text="No Restaurants Found"
//           />
//         )}
//       </div>
//     </>
//   );
// };

// export default OrderNow;



import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api.config";
import toast from "react-hot-toast";
import Loader from "../assets/runningLoader.gif";
import NoDataFound from "../components/NoDataFound";
import defaultRestaurantImage from "../assets/Samplerestaurant.jpg";
import heroBg from "../assets/carousel/bgImage1.jpg";

import {
  IoSearch,
  IoLocationOutline,
  IoTimeOutline,
  IoStar,
  IoStorefrontOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

import {
  FaLeaf,
  FaDrumstickBite,
  FaUtensils,
} from "react-icons/fa";

import { MdOutlineRestaurantMenu } from "react-icons/md";
import { TbToolsKitchen2 } from "react-icons/tb";

// Restaurant Types
const RESTAURANT_TYPES = [
  {
    value: "all",
    label: "All",
    icon: null,
  },
  {
    value: "veg",
    label: "Veg",
    icon: <FaLeaf className="text-green-500" />,
  },
  {
    value: "non-veg",
    label: "Non-Veg",
    icon: <FaDrumstickBite className="text-red-500" />,
  },
  {
    value: "vegan",
    label: "Vegan",
    icon: <FaLeaf className="text-green-600" />,
  },
  {
    value: "jain",
    label: "Jain",
    icon: <FaLeaf className="text-orange-500" />,
  },
  {
    value: "both",
    label: "Veg & Non-Veg",
    icon: <MdOutlineRestaurantMenu className="text-purple-500" />,
  },
];

// Restaurant Type Styles
const typeStyles = {
  veg: "bg-green-50 text-green-700 border-green-200",
  "non-veg": "bg-red-50 text-red-700 border-red-200",
  vegan: "bg-green-50 text-green-800 border-green-200",
  jain: "bg-orange-50 text-orange-700 border-orange-200",
  both: "bg-purple-50 text-purple-700 border-purple-200",
};

// Restaurant Type Labels
const typeLabels = {
  veg: "Pure Veg",
  "non-veg": "Non-Veg",
  vegan: "Vegan",
  jain: "Jain",
  both: "Veg & Non-Veg",
};

const OrderNow = () => {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  // Fetch Restaurants
  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);

      const response = await api.get("/public/restaurants");

      setRestaurants(response.data?.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred during fetching restaurants. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on page load
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Navigate to Restaurant Details
  const handleRestaurant = (restaurant) => {
    navigate(`/restaurant-details/${restaurant._id}`);
  };

  // Filter Restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const q = searchQuery.trim().toLowerCase();

      // Search filter
      const matchSearch =
        !q ||
        restaurant.restaurantName?.toLowerCase().includes(q) ||
        restaurant.description?.toLowerCase().includes(q) ||
        restaurant.city?.toLowerCase().includes(q) ||
        restaurant.address?.toLowerCase().includes(q) ||
        restaurant.cuisineTypes?.some((cuisine) =>
          cuisine?.toLowerCase().includes(q)
        );

      // Restaurant type filter
      const matchType =
        selectedType === "all" ||
        restaurant.restaurantType?.toLowerCase() === selectedType;

      // Open restaurant filter
      const matchOpen = !showOpenOnly || restaurant.isOpen === true;

      return matchSearch && matchType && matchOpen;
    });
  }, [restaurants, searchQuery, selectedType, showOpenOnly]);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-base-200)">
        <img
          src={Loader}
          alt="Loading..."
          className="w-32 h-32 object-contain"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-base-200)">
      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <div className="relative overflow-hidden min-h-72 md:min-h-80 flex items-center justify-center text-center px-5 py-16">
        {/* Background Image */}
        <img
          src={heroBg}
          alt="Food background"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/70" />

        {/* Floating Icons */}
        <FaUtensils className="absolute top-8 left-10 text-white/10 text-6xl rotate-12 hidden md:block" />

        <MdOutlineRestaurantMenu className="absolute bottom-10 right-14 text-white/10 text-7xl -rotate-12 hidden md:block" />

        <FaLeaf className="absolute top-12 right-24 text-white/10 text-5xl rotate-6 hidden md:block" />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-2xl mx-auto">
          {/* Small Badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-(--color-primary) bg-white/90 px-3 py-1 rounded-full mb-4 shadow">
            <TbToolsKitchen2 className="text-sm" />
            Cravings — Order Now
          </span>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg mb-3">
            Hungry?{" "}
            <span className="text-(--color-warning)">
              We've got you.
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm md:text-base text-white/75 mb-8 leading-relaxed">
            Discover the best restaurants around you and get your favourite
            meal delivered fresh.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-secondary) text-lg" />

            <input
              type="text"
              placeholder="Search by name, cuisine or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm bg-white text-(--color-base-content) shadow-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/50"
            />
          </div>

          {/* Statistics */}
          {restaurants.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
              {/* Total Restaurants */}
              <span className="flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/20">
                <IoStorefrontOutline />
                {restaurants.length} Restaurants
              </span>

              {/* Open Restaurants */}
              <span className="flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/20">
                <IoCheckmarkCircleOutline className="text-green-400" />
                {restaurants.filter((r) => r.isOpen === true).length} Open Now
              </span>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          FILTER SECTION
      ====================================================== */}
      <div className="sticky top-16 z-10 bg-(--color-base-100) border-b border-(--color-base-300) shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-3 flex flex-wrap items-center gap-2">
          {/* Restaurant Type Buttons */}
          {RESTAURANT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                selectedType === type.value
                  ? "bg-(--color-primary) text-(--color-primary-content) border-(--color-primary)"
                  : "bg-white text-(--color-base-content) border-(--color-base-300) hover:border-(--color-primary)"
              }`}
            >
              {type.icon}
              {type.label}
            </button>
          ))}

          {/* Open Now Checkbox */}
          <label className="ml-auto flex items-center gap-2 text-xs font-medium text-(--color-base-content) cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOpenOnly}
              onChange={(e) => setShowOpenOnly(e.target.checked)}
              className="accent-(--color-primary) w-3.5 h-3.5"
            />

            Open Now
          </label>

          {/* Result Count */}
          <span className="text-xs text-(--color-secondary)">
            {filteredRestaurants.length} restaurant
            {filteredRestaurants.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* =====================================================
          RESTAURANT GRID
      ====================================================== */}
      <div className="max-w-7xl mx-auto px-5 py-7">
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => handleRestaurant(restaurant)}
                className="bg-(--color-base-100) rounded-2xl overflow-hidden border border-(--color-base-300) shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
              >
                {/* =================================================
                    COVER IMAGE
                ================================================== */}
                <div className="relative w-full h-48 overflow-hidden bg-(--color-base-300)">
                  <img
                    src={
                      restaurant?.coverImage?.url ||
                      defaultRestaurantImage
                    }
                    alt={restaurant.restaurantName || "Restaurant"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* =================================================
                      OPEN / CLOSED BADGE
                  ================================================== */}
                  <span
                    className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      restaurant.isOpen
                        ? "bg-green-500 text-white"
                        : "bg-black/60 text-white"
                    }`}
                  >
                    {restaurant.isOpen ? "● Open" : "● Closed"}
                  </span>

                  {/* =================================================
                      RATING
                  ================================================== */}
                  {restaurant.averageRating > 0 && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                      <IoStar className="text-[11px]" />

                      {Number(restaurant.averageRating).toFixed(1)}
                    </span>
                  )}

                  {/* =================================================
                      RESTAURANT TYPE
                  ================================================== */}
                  {restaurant.restaurantType && (
                    <span
                      className={`absolute bottom-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        typeStyles[
                          restaurant.restaurantType?.toLowerCase()
                        ] ||
                        "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {typeLabels[
                        restaurant.restaurantType?.toLowerCase()
                      ] || restaurant.restaurantType}
                    </span>
                  )}
                </div>

                {/* =================================================
                    CARD BODY
                ================================================== */}
                <div className="p-4">
                  {/* Restaurant Name */}
                  <h2 className="text-base font-bold text-(--color-base-content) truncate mb-0.5">
                    {restaurant.restaurantName || "Unnamed Restaurant"}
                  </h2>

                  {/* Description */}
                  <p className="text-xs text-(--color-secondary) line-clamp-2 mb-3 leading-relaxed">
                    {restaurant.description ||
                      "No description available."}
                  </p>

                  {/* =================================================
                      CUISINE TYPES
                  ================================================== */}
                  {restaurant.cuisineTypes?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {restaurant.cuisineTypes
                        .slice(0, 3)
                        .map((cuisine, index) => (
                          <span
                            key={`${cuisine}-${index}`}
                            className="text-[10px] px-2 py-0.5 bg-(--color-base-200) text-(--color-secondary) rounded-full border border-(--color-base-300)"
                          >
                            {cuisine}
                          </span>
                        ))}

                      {/* More cuisines */}
                      {restaurant.cuisineTypes.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 bg-(--color-base-200) text-(--color-secondary) rounded-full border border-(--color-base-300)">
                          +{restaurant.cuisineTypes.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* =================================================
                      META INFORMATION
                  ================================================== */}
                  <div className="flex items-center justify-between text-xs text-(--color-secondary) border-t border-(--color-base-300) pt-3 gap-2">
                    {/* Location */}
                    {(restaurant.city || restaurant.address) && (
                      <span className="flex items-center gap-1 truncate">
                        <IoLocationOutline className="shrink-0" />

                        <span className="truncate">
                          {restaurant.city || restaurant.address}
                        </span>
                      </span>
                    )}

                    {/* Serving Hours */}
                    {restaurant.servingHours?.openingTime && (
                      <span className="flex items-center gap-1 shrink-0">
                        <IoTimeOutline className="shrink-0" />

                        {restaurant.servingHours.openingTime}

                        {" – "}

                        {restaurant.servingHours.closingTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
         
          <NoDataFound
            height="60vh"
            width="100%"
            text="No Restaurants Found"
          />
        )}
      </div>
    </div>
  );
};

export default OrderNow;