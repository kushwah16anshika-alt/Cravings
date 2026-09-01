import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/api.config";
import Loader from "../Loader";
import { IoHeart, IoStar } from "react-icons/io5";
import { MdArrowForward } from "react-icons/md";

const Wishlist = () => {
  const navigate = useNavigate();
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cravings_favorites") || "[]");
    } catch {
      return [];
    }
  });

  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/public/restaurants");
        setRestaurants(res.data?.data || []);
      } catch (err) {
        console.error("Wishlist restaurant fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const favoriteRestaurants = restaurants.filter((r) =>
    favoriteIds.includes(r._id)
  );

  const removeFavorite = (id) => {
    const updated = favoriteIds.filter((item) => item !== id);
    setFavoriteIds(updated);
    localStorage.setItem("cravings_favorites", JSON.stringify(updated));
  };

  if (isLoading) {
    return <Loader height="250px" text="Loading saved eateries..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
          Saved Favorites
        </h2>
        <p className="text-xs sm:text-sm font-normal text-slate-500">
          Your bookmarked campus dining spots for quick ordering
        </p>
      </div>

      {favoriteRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteRestaurants.map((restaurant) => {
            const coverUrl =
              restaurant.coverImage?.url ||
              restaurant.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80";

            return (
              <div
                key={restaurant._id}
                onClick={() => navigate(`/restaurant-details/${restaurant._id}`)}
                className="group relative flex flex-col rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-orange-200 cursor-pointer overflow-hidden transition"
              >
                {/* Cover Image */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <img
                    src={coverUrl}
                    alt={restaurant.restaurantName}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(restaurant._id);
                    }}
                    title="Remove from favorites"
                    className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-xs hover:bg-white active:scale-95 transition"
                  >
                    <IoHeart size={15} />
                  </button>

                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[11px] font-bold text-slate-900 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs">
                    <IoStar className="text-amber-500" size={12} />
                    <span>{restaurant.averageRating || 4.5}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                  <div>
                    <h4 className="font-heading text-sm font-bold text-slate-900 group-hover:text-orange-600 transition truncate">
                      {restaurant.restaurantName}
                    </h4>
                    <p className="text-xs font-normal text-slate-500 line-clamp-1 mt-0.5">
                      {restaurant.description || "Campus eatery"}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600">
                    <span>View Menu</span>
                    <MdArrowForward />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 p-8 max-w-md mx-auto space-y-2">
          <h3 className="font-heading text-lg font-bold text-slate-900">
            Nothing saved yet
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
            Click the heart icon on any restaurant or dish to save your campus favorites here.
          </p>
          <div className="pt-3">
            <Link
              to="/order-now"
              className="inline-block px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-sm shadow-orange-600/30 hover:bg-orange-500 transition"
            >
              Explore Restaurants
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;