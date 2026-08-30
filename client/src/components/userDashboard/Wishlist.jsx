import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/api.config";
import Loader from "../Loader";
import { IoHeart, IoStar, IoTimeOutline, IoLocationOutline } from "react-icons/io5";
import { MdArrowForward, MdOutlineRestaurant } from "react-icons/md";

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
        <h2 className="font-heading text-2xl font-black text-slate-900">
          Saved Favorites & Wishlist
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-500">
          Your bookmarked campus dining spots for quick ordering
        </p>
      </div>

      {favoriteRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRestaurants.map((restaurant) => {
            const coverUrl =
              restaurant.coverImage?.url ||
              restaurant.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80";

            return (
              <div
                key={restaurant._id}
                onClick={() => navigate(`/restaurant-details/${restaurant._id}`)}
                className="group relative flex flex-col rounded-3xl bg-white border border-slate-200/80 shadow-xs card-hover cursor-pointer overflow-hidden"
              >
                {/* Cover Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={coverUrl}
                    alt={restaurant.restaurantName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(restaurant._id);
                    }}
                    title="Remove from favorites"
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md shadow-red-500/30 active:scale-90 transition"
                  >
                    <IoHeart size={16} />
                  </button>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-black text-amber-400">
                    <IoStar size={14} />
                    <span>{restaurant.averageRating || 4.5}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                  <div>
                    <h4 className="font-heading text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition truncate">
                      {restaurant.restaurantName}
                    </h4>
                    <p className="text-xs font-medium text-slate-500 line-clamp-1 mt-0.5">
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
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto space-y-3">
          <div className="h-20 w-20 rounded-full bg-orange-50 mx-auto flex items-center justify-center text-4xl">
            🍴
          </div>
          <h3 className="font-heading text-xl font-bold text-slate-900">
            Nothing saved yet
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Click the heart icon on any restaurant or dish to save your campus favorites here.
          </p>
          <Link
            to="/order-now"
            className="inline-block mt-2 px-6 py-2.5 rounded-2xl bg-orange-600 text-white font-black text-xs shadow-md shadow-orange-600/30 hover:bg-orange-500 transition"
          >
            Explore Restaurants
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;