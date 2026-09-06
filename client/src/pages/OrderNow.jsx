import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api.config";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import NoDataFound from "../components/NoDataFound";
import AISearchModal from "../components/AISearchModal";

import {
  IoSearch,
  IoLocationOutline,
  IoTimeOutline,
  IoStar,
  IoStorefrontOutline,
  IoHeart,
  IoHeartOutline,
  IoSparkles,
  IoFlame,
} from "react-icons/io5";

import {
  FaLeaf,
  FaDrumstickBite,
  FaUtensils,
} from "react-icons/fa";
import { MdOutlineRestaurantMenu, MdArrowForward } from "react-icons/md";

// Restaurant Types
const RESTAURANT_TYPES = [
  { value: "all", label: "All Eateries", emoji: "🍽️" },
  { value: "veg", label: "Pure Veg", emoji: "🌿" },
  { value: "non-veg", label: "Non-Veg", emoji: "🍗" },
  { value: "vegan", label: "Vegan", emoji: "🌱" },
  { value: "jain", label: "Jain Friendly", emoji: "✨" },
  { value: "both", label: "Multi-Cuisine", emoji: "🍕" },
];

const OrderNow = () => {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalQuery, setAiModalQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const [savedFavorites, setSavedFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cravings_favorites") || "[]");
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setSavedFavorites((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("cravings_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  // Fetch Restaurants
  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/public/restaurants");
      setRestaurants(response.data?.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch restaurants. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Filter Restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const name = restaurant.restaurantName?.toLowerCase() || "";
      const description = restaurant.description?.toLowerCase() || "";
      const city = (
        restaurant.city ||
        (typeof restaurant.address === "object" ? restaurant.address?.city : restaurant.address) ||
        ""
      ).toLowerCase();

      let cuisines = [];
      const rawCuisines = restaurant.cuisineTypes || restaurant.cuisineType || [];
      if (Array.isArray(rawCuisines)) {
        cuisines = rawCuisines;
      } else if (typeof rawCuisines === "string") {
        cuisines = rawCuisines.split(",").map((s) => s.trim());
      }
      const cuisineStr = cuisines.join(" ").toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        name.includes(query) ||
        description.includes(query) ||
        city.includes(query) ||
        cuisineStr.includes(query);

      const matchesType =
        selectedType === "all" ||
        restaurant.restaurantType?.toLowerCase() === selectedType ||
        (selectedType === "veg" && (restaurant.isPureVeg || restaurant.restaurantType === "veg"));

      const matchesOpen = !showOpenOnly || restaurant.isOpen;
      const matchesRating = minRating === 0 || (restaurant.averageRating || 4.2) >= minRating;

      return matchesSearch && matchesType && matchesOpen && matchesRating;
    });
  }, [restaurants, searchQuery, selectedType, showOpenOnly, minRating]);

  return (
    <div className="min-h-screen bg-[#fcfaf7] pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white py-12 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <IoSparkles />
            <span>Campus Dining Hub</span>
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black tracking-tight">
            Order From Top Campus Kitchens
          </h1>
          <p className="text-sm sm:text-base text-orange-100 max-w-xl font-medium">
            Explore authentic flavors, quick snacks, and gourmet meals delivered right to you.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Search & Filter Bar Card */}
        <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-xl shadow-orange-950/5 border border-orange-100 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-orange-600">
                  <IoSearch size={20} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      setAiModalQuery(searchQuery);
                      setIsAiModalOpen(true);
                    }
                  }}
                  placeholder="Search by restaurant name, cuisine, dish, or campus zone..."
                  className="w-full pl-11 pr-14 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold placeholder:text-slate-400 focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Ask AI Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  setAiModalQuery(searchQuery);
                  setIsAiModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-3 text-xs font-extrabold text-white shadow-md shadow-orange-600/25 hover:from-orange-500 hover:to-amber-500 active:scale-95 transition whitespace-nowrap"
              >
                <IoSparkles size={15} className="animate-pulse" />
                <span>Ask AI</span>
              </button>
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setMinRating((prev) => (prev === 4 ? 0 : 4))}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-extrabold border transition ${
                  minRating === 4
                    ? "bg-amber-500 border-amber-600 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:border-amber-400"
                }`}
              >
                <IoStar size={14} />
                <span>4.0+ Stars</span>
              </button>

              <button
                onClick={() => setShowOpenOnly((prev) => !prev)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-extrabold border transition ${
                  showOpenOnly
                    ? "bg-emerald-600 border-emerald-700 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:border-emerald-400"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Open Now</span>
              </button>
            </div>
          </div>

          {/* Diet Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {RESTAURANT_TYPES.map((type) => {
              const active = selectedType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                    active
                      ? "bg-orange-600 text-white shadow-sm shadow-orange-600/30 scale-102"
                      : "bg-slate-100/80 text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  <span>{type.emoji}</span>
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mt-8 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-black text-slate-900">
              Available Restaurants
            </h2>
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-extrabold text-orange-700">
              {filteredRestaurants.length}
            </span>
          </div>

          {(searchQuery || selectedType !== "all" || showOpenOnly || minRating > 0) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
                setShowOpenOnly(false);
                setMinRating(0);
              }}
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Restaurant Grid */}
        {isLoading ? (
          <Loader height="350px" text="Discovering verified kitchens..." />
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => {
              const isFav = savedFavorites.includes(restaurant._id);
              const coverUrl =
                restaurant.coverImage?.url ||
                restaurant.restaurantImage?.[0]?.url ||
                restaurant.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80";

              let cuisines = [];
              const rawCuisines = restaurant.cuisineTypes || restaurant.cuisineType || [];
              if (Array.isArray(rawCuisines)) {
                cuisines = rawCuisines;
              } else if (typeof rawCuisines === "string") {
                cuisines = rawCuisines.split(",").map((s) => s.trim());
              }

              const isPureVeg = restaurant.isPureVeg || restaurant.restaurantType === "veg";

              return (
                <div
                  key={restaurant._id}
                  onClick={() => navigate(`/restaurant-details/${restaurant._id}`)}
                  className="group flex flex-col rounded-3xl bg-white border border-slate-200/80 shadow-xs card-hover cursor-pointer overflow-hidden"
                >
                  {/* Image & Badges */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={coverUrl}
                      alt={restaurant.restaurantName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-extrabold backdrop-blur-md shadow-xs">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isPureVeg ? "bg-emerald-500" : "bg-orange-500"
                          }`}
                        />
                        <span className={isPureVeg ? "text-emerald-700" : "text-slate-800"}>
                          {isPureVeg ? "Pure Veg" : "Multi-Cuisine"}
                        </span>
                      </div>

                      <button
                        onClick={(e) => toggleFavorite(restaurant._id, e)}
                        title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                        className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition active:scale-90 ${
                          isFav
                            ? "bg-red-500 text-white shadow-md shadow-red-500/30"
                            : "bg-white/85 text-slate-700 hover:text-red-500"
                        }`}
                      >
                        {isFav ? <IoHeart size={16} /> : <IoHeartOutline size={16} />}
                      </button>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1 rounded-lg bg-black/40 px-2 py-0.5 text-xs font-bold backdrop-blur-xs">
                        <IoTimeOutline size={14} />
                        <span>{restaurant.deliveryTime || "20-25 min"}</span>
                      </div>

                      <div className="flex items-center gap-1 rounded-lg bg-amber-500/90 px-2 py-0.5 text-xs font-extrabold text-slate-950 backdrop-blur-xs shadow-xs">
                        <IoStar size={13} className="text-slate-950" />
                        <span>{restaurant.averageRating || 4.5}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
                    <div>
                      <h3 className="font-heading text-lg font-black text-slate-900 group-hover:text-orange-600 transition truncate">
                        {restaurant.restaurantName}
                      </h3>

                      <p className="text-xs font-medium text-slate-500 line-clamp-2 mt-1">
                        {restaurant.description || "Fresh and flavorful meals prepared with love."}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {cuisines.slice(0, 3).map((cuisine, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg bg-orange-50 px-2 py-0.5 text-[10px] font-extrabold text-orange-700"
                          >
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                      <span className="flex items-center gap-1">
                        <IoLocationOutline size={14} className="text-orange-600" />
                        <span>
                          {restaurant.city ||
                            (typeof restaurant.address === "object"
                              ? restaurant.address?.city
                              : restaurant.address) ||
                            "Campus Main"}
                        </span>
                      </span>

                      <span className="text-orange-600 font-extrabold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        <span>View Menu</span>
                        <MdArrowForward />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
            <span className="text-5xl">🍽️</span>
            <h3 className="font-heading text-xl font-bold text-slate-900 mt-4">
              No eateries found
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search terms or dietary filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
                setShowOpenOnly(false);
                setMinRating(0);
              }}
              className="mt-5 px-6 py-2.5 rounded-2xl bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-600/30 hover:bg-orange-500 transition"
            >
              Show All Restaurants
            </button>
          </div>
        )}
      </div>

      {/* AI Craving Search Modal */}
      <AISearchModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialQuery={aiModalQuery}
      />
    </div>
  );
};

export default OrderNow;