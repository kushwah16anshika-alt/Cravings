import React from "react";
import { IoArrowBack, IoStar, IoTimeOutline, IoLocationOutline } from "react-icons/io5";
import { restaurantTypeLabel } from "./helpers";

const RestaurantHero = ({ restaurant, onBack }) => {
  const typeInfo = restaurantTypeLabel(restaurant.restaurantType);

  let cuisines = [];
  if (Array.isArray(restaurant.cuisineType)) {
    cuisines = restaurant.cuisineType;
  } else if (typeof restaurant.cuisineType === "string") {
    cuisines = restaurant.cuisineType.split(",").map((s) => s.trim()).filter(Boolean);
  }

  const coverUrl =
    restaurant.coverImage?.url ||
    restaurant.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="relative w-full h-80 md:h-[400px] overflow-hidden bg-slate-950">
      <img
        src={coverUrl}
        alt={restaurant.restaurantName}
        className="w-full h-full object-cover opacity-85"
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2 text-xs font-extrabold text-white backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/30 active:scale-95 transition"
      >
        <IoArrowBack size={16} />
        <span>Back to Eateries</span>
      </button>

      {/* Hero content */}
      <div className="absolute bottom-0 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 text-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full backdrop-blur-md shadow-xs ${typeInfo.color}`}
              >
                {typeInfo.icon}
                {typeInfo.label}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full backdrop-blur-md shadow-xs ${
                  restaurant.isOpen
                    ? "bg-emerald-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                {restaurant.isOpen ? "Open Now" : "Closed"}
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-black text-white drop-shadow-md">
              {restaurant.restaurantName}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-slate-300">
              <span className="flex items-center gap-1 text-slate-200">
                <IoLocationOutline size={16} className="text-orange-400" />
                {restaurant.address?.city || "Campus Central"}
              </span>

              <span>•</span>

              <span className="flex items-center gap-1 text-slate-200">
                <IoTimeOutline size={16} className="text-orange-400" />
                {restaurant.deliveryTime || "20-25 min delivery"}
              </span>
            </div>

            {/* Cuisine Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {cuisines.map((c, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-white/15 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-md border border-white/10"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Rating Box */}
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-heading font-black text-xl shadow-md">
              <IoStar size={20} />
            </div>
            <div>
              <p className="font-heading text-xl font-black text-white leading-none">
                {(restaurant.averageRating || 4.5).toFixed(1)}
              </p>
              <p className="text-[11px] font-bold text-slate-300">500+ ratings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHero;