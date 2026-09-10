import React from "react";
import {
  MdOutlineDashboard,
  MdOutlineMenuBook,
  MdOutlineShoppingBag,
  MdOutlineSettings,
  MdOutlineStorefront,
} from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../config/api.config";
import toast from "react-hot-toast";

const RestaurantSidebar = ({ activeTab, setActiveTab, restaurantData, liveOrdersCount = 0 }) => {
  const { user, setUser, setIsLogin, setRole } = useAuth();
  const navigate = useNavigate();

  const mainTabs = [
    {
      name: "Kitchen Overview",
      value: "overview",
      icon: <MdOutlineDashboard size={20} />,
      badge: null,
    },
    {
      name: "Live Orders",
      value: "orders",
      icon: <MdOutlineShoppingBag size={20} />,
      badge: liveOrdersCount > 0 ? liveOrdersCount : null,
      badgeColor: "bg-orange-500 text-white animate-pulse",
    },
    {
      name: "Menu & Dishes",
      value: "menu",
      icon: <MdOutlineMenuBook size={20} />,
      badge: null,
    },
    {
      name: "Store Settings",
      value: "settings",
      icon: <MdOutlineSettings size={20} />,
      badge: null,
    },
  ];

  const handleLogout = async () => {
    try {
      const res = await api.get("/auth/logout");
      toast.success(res.data?.message || "Logged out successfully");
      sessionStorage.removeItem("cravingUser");
      sessionStorage.removeItem("cravingRestaurant");
      sessionStorage.removeItem("RestaurantOpen");
      setUser(null);
      setIsLogin(false);
      setRole(null);
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const displayName =
    restaurantData?.restaurantName ||
    user?.fullName ||
    user?.fullname ||
    "Kitchen Partner";

  const isOpen = restaurantData?.isOpen;

  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div className="space-y-6">
        {/* Restaurant Mini Profile Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-slate-50 border border-orange-200/80 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/20">
              {restaurantData?.coverImage?.url ? (
                <img
                  src={restaurantData.coverImage.url}
                  alt={displayName}
                  className="h-full w-full object-cover rounded-2xl"
                />
              ) : (
                <MdOutlineStorefront size={26} />
              )}
              {/* Online / Offline status dot */}
              <span
                className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                  isOpen ? "bg-emerald-500" : "bg-slate-400"
                }`}
                title={isOpen ? "Accepting Orders" : "Kitchen Closed"}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-sm font-black text-slate-900 truncate">
                {displayName}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isOpen
                      ? "text-emerald-700 bg-emerald-100"
                      : "text-slate-600 bg-slate-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isOpen ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                    }`}
                  />
                  {isOpen ? "Open" : "Closed"}
                </span>
                <span className="text-[10px] font-bold text-slate-400 truncate">
                  Partner Hub
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3">
            Kitchen Management
          </p>
          {mainTabs.map((tab) => {
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 text-left ${
                  active
                    ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30 scale-102"
                    : "text-slate-700 hover:bg-orange-50/80 hover:text-orange-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={active ? "text-white" : "text-orange-600"}>
                    {tab.icon}
                  </span>
                  <span>{tab.name}</span>
                </div>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      active
                        ? "bg-white text-orange-600"
                        : tab.badgeColor || "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-xs font-extrabold text-red-600 hover:bg-red-50 transition border border-red-100"
      >
        <HiOutlineLogout size={18} />
        <span>Exit Partner Panel</span>
      </button>
    </div>
  );
};

export default RestaurantSidebar;