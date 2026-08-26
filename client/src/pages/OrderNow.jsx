import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api.config";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
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
          "Failed to fetch restaurants. Please try again."
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
    return <Loader height="70vh" width="100%" text="Finding top restaurants near you..." />;
  }

  return (
    <div className="min-h-screen bg-(--color-base-200) pb-16">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden min-h-72 md:min-h-80 flex items-center justify-center text-center px-5 py-16">
        <img
          src={heroBg}
          alt="Food background"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/85" />

        <FaUtensils className="absolute top-8 left-10 text-white/10 text-6xl rotate-12 hidden md:block" />
        <MdOutlineRestaurantMenu className="absolute bottom-10 right-14 text-white/10 text-7xl -rotate-12 hidden md:block" />
        <FaLeaf className="absolute top-12 right-24 text-white/10 text-5xl rotate-6 hidden md:block" />

        <div className="relative z-10 w-full max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-(--color-primary) bg-white/90 px-3 py-1 rounded-full mb-4 shadow">
            <TbToolsKitchen2 className="text-sm" />
            Cravings — Order Now
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg mb-3">
            Hungry? <span className="text-(--color-primary)">We've got you.</span>
          </h1>

          <p className="text-sm md:text-base text-white/75 mb-8 leading-relaxed">
            Discover the best restaurants around you and get your favourite meal delivered fresh.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search by name, cuisine, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm bg-white text-slate-900 shadow-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>

          {/* Statistics */}
          {restaurants.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/20">
                <IoStorefrontOutline />
                {restaurants.length} Restaurants
              </span>

              <span className="flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/20">
                <IoCheckmarkCircleOutline className="text-green-400" />
                {restaurants.filter((r) => r.isOpen === true).length} Open Now
              </span>
            </div>
          )}
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="sticky top-16 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {RESTAURANT_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full border transition font-medium ${
                  selectedType === type.value
                    ? "bg-(--color-primary) text-white border-(--color-primary) shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-(--color-primary)"
                }`}
              >
                {type.icon}
                {type.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showOpenOnly}
              onChange={(e) => setShowOpenOnly(e.target.checked)}
              className="w-4 h-4 rounded text-(--color-primary) focus:ring-(--color-primary)"
            />
            <span>Open Restaurants Only</span>
          </label>
        </div>
      </div>

      {/* RESTAURANTS GRID */}
      <div className="max-w-7xl mx-auto px-5 pt-8">
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => {
              const coverUrl =
                restaurant.coverImage?.url ||
                restaurant.restaurantImage?.[0]?.url ||
                defaultRestaurantImage;

              return (
                <div
                  key={restaurant._id}
                  onClick={() => handleRestaurant(restaurant)}
                  className="bg-(--color-base-100) rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer flex flex-col group"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={coverUrl}
                      alt={restaurant.restaurantName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          restaurant.isOpen
                            ? "bg-green-500 text-white"
                            : "bg-slate-800/80 text-white"
                        }`}
                      >
                        {restaurant.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>

                    {restaurant.restaurantType && (
                      <span
                        className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          typeStyles[restaurant.restaurantType] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {typeLabels[restaurant.restaurantType] ||
                          restaurant.restaurantType}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-(--color-primary) transition">
                          {restaurant.restaurantName}
                        </h2>

                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg text-xs font-bold">
                          <IoStar className="text-amber-500" />
                          <span>
                            {restaurant.averageRating
                              ? restaurant.averageRating.toFixed(1)
                              : "4.5"}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {restaurant.description ||
                          "Delicious food prepared with love and top-tier culinary excellence."}
                      </p>

                      {restaurant.cuisineTypes?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {restaurant.cuisineTypes.slice(0, 3).map((cuisine, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md font-medium"
                            >
                              {cuisine}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <IoLocationOutline className="text-slate-400" />
                        {restaurant.city || "Bangalore"}
                      </span>

                      <span className="flex items-center gap-1">
                        <IoTimeOutline className="text-slate-400" />
                        {restaurant.servingHours?.openingTime || "09:00"} -{" "}
                        {restaurant.servingHours?.closingTime || "22:00"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <NoDataFound
            height="400px"
            width="100%"
            text="No matching restaurants found. Try adjusting your filters."
          />
        )}
      </div>
    </div>
  );
};

export default OrderNow;