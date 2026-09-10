import React, { useEffect, useState, useMemo, useCallback } from "react";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import Loader from "../Loader";
import {
  IoSearch,
  IoStar,
  IoLocationOutline,
} from "react-icons/io5";
import { MdRefresh, MdOutlineRestaurantMenu } from "react-icons/md";
import { RiLoader4Fill } from "react-icons/ri";

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/admin/restaurants");
      if (res.data?.success) {
        setRestaurants(res.data.data || []);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load campus restaurants"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleToggleStatus = async (restaurantId, currentIsOpen) => {
    try {
      setTogglingId(restaurantId);
      const res = await api.patch(
        `/admin/restaurants/${restaurantId}/toggle-status`,
        { isOpen: !currentIsOpen }
      );

      if (res.data?.success) {
        toast.success(res.data.message || "Store status updated");
        setRestaurants((prev) =>
          prev.map((r) =>
            r._id === restaurantId ? { ...r, isOpen: !currentIsOpen } : r
          )
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to toggle restaurant status"
      );
    } finally {
      setTogglingId(null);
    }
  };

  const filteredRestaurants = useMemo(() => {
    if (!searchQuery.trim()) return restaurants;
    const q = searchQuery.toLowerCase().trim();
    return restaurants.filter(
      (r) =>
        r.restaurantName?.toLowerCase().includes(q) ||
        r.city?.toLowerCase().includes(q) ||
        r.manager?.fullname?.toLowerCase().includes(q) ||
        r.manager?.email?.toLowerCase().includes(q) ||
        (r.cuisineTypes || []).some((c) => c.toLowerCase().includes(q))
    );
  }, [restaurants, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
            Campus Eateries & Canteens
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage campus dining partners, operational status, menu items, and manager contacts
          </p>
        </div>

        <button
          onClick={fetchRestaurants}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-2xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
        >
          <MdRefresh size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="relative">
          <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600 text-base" />
          <input
            type="text"
            placeholder="Search kitchens by name, cuisine, city, or manager..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
          />
        </div>
      </div>

      {/* Kitchens Cards Grid */}
      {isLoading ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <Loader
            height="250px"
            width="100%"
            text="Fetching campus restaurants & menus..."
          />
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="py-16 bg-white rounded-3xl border border-slate-200/80 text-center text-slate-400 space-y-2">
          <span className="text-4xl">🏪</span>
          <p className="text-sm font-bold text-slate-700">No restaurants found</p>
          <p className="text-xs text-slate-400">
            Try searching with a different kitchen name or cuisine.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRestaurants.map((res) => (
            <div
              key={res._id}
              className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs hover:border-orange-200 transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header with status badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-lg flex-shrink-0 overflow-hidden">
                      {res.coverImage ? (
                        <img
                          src={res.coverImage}
                          alt={res.restaurantName}
                          className="h-full w-full object-cover rounded-2xl"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        res.restaurantName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-heading text-sm font-black text-slate-900 truncate">
                        {res.restaurantName}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <IoLocationOutline className="text-orange-600" />
                        <span className="truncate">{res.city}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      res.isOpen
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {res.isOpen ? "Open" : "Closed"}
                  </span>
                </div>

                {/* Rating & Menu count pill */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 border border-amber-200/60">
                    <IoStar className="text-amber-500" />
                    <span>{res.averageRating}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                    <MdOutlineRestaurantMenu />
                    <span>{res.menuCount} dishes</span>
                  </span>

                  <span className="inline-block rounded-xl bg-orange-50 px-2.5 py-1 text-[10px] font-extrabold text-orange-700">
                    {res.restaurantType}
                  </span>
                </div>

                {/* Cuisines */}
                {res.cuisineTypes?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {res.cuisineTypes.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-100"
                      >
                        {c}
                      </span>
                    ))}
                    {res.cuisineTypes.length > 3 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        +{res.cuisineTypes.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Manager Info */}
                {res.manager && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs text-slate-600">
                    <p className="font-bold text-slate-900">
                      Manager: {res.manager.fullname}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {res.manager.email}
                    </p>
                    {res.manager.phone && (
                      <p className="text-[11px] text-slate-500">
                        Tel: {res.manager.phone}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Store Control:
                </span>
                <button
                  onClick={() => handleToggleStatus(res._id, res.isOpen)}
                  disabled={togglingId === res._id}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition shadow-xs ${
                    res.isOpen
                      ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-600 hover:text-white"
                  }`}
                >
                  {togglingId === res._id ? (
                    <RiLoader4Fill className="animate-spin" />
                  ) : null}
                  <span>{res.isOpen ? "Close Kitchen" : "Open Kitchen"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRestaurants;
