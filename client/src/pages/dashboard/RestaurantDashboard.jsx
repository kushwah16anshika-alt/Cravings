import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RestaurantSidebar from "../../components/restaurantDashboard/RestaurantSidebar";
import RestaurantOverview from "../../components/restaurantDashboard/RestaurantOverview";
import RestaurantMenu from "../../components/restaurantDashboard/RestaurantMenu";
import RestaurantOrders from "../../components/restaurantDashboard/RestaurantOrders";
import RestaurantSetting from "../../components/restaurantDashboard/RestaurantSetting";
import api from "../../config/api.config";
import {
  MdOutlineDashboard,
  MdOutlineShoppingBag,
  MdOutlineMenuBook,
  MdOutlineSettings,
} from "react-icons/md";

const RestaurantDashboard = () => {
  const { isLogin, role, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "overview"
  );
  const [restaurantData, setRestaurantData] = useState(null);
  const [liveOrdersCount, setLiveOrdersCount] = useState(0);

  const fetchRestaurantProfile = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await api.get(`/restaurant/get-resturant-data?id=${user._id}`);
      if (res.data?.data) {
        setRestaurantData(res.data.data);
      }
      // Also fetch stats to get live order badge count
      const statsRes = await api.get("/restaurant/dashboard-stats");
      if (statsRes.data?.success) {
        setLiveOrdersCount(statsRes.data.data?.liveOrdersCount || 0);
      }
    } catch (err) {
      console.error("Failed to load restaurant profile:", err);
    }
  }, [user]);

  useEffect(() => {
    if (isLogin && role === "restaurant") {
      fetchRestaurantProfile();
    }
  }, [isLogin, role, fetchRestaurantProfile]);

  if (!isLogin || role !== "restaurant") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-[#fcfaf7]">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center max-w-md shadow-xl space-y-4">
          <span className="text-4xl">🧑‍🍳</span>
          <h1 className="font-heading text-2xl font-black text-slate-900">
            Restaurant Partner Portal
          </h1>
          <p className="text-slate-500 text-xs font-medium">
            Please log in with a Restaurant Partner account to manage menu items, receive live customer orders, and update kitchen timings.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-extrabold text-xs rounded-2xl shadow-md hover:from-orange-500 hover:to-amber-500 transition"
          >
            Sign In as Restaurant
          </button>
        </div>
      </div>
    );
  }

  const mobileTabs = [
    { label: "Overview", value: "overview", icon: <MdOutlineDashboard size={18} /> },
    { label: "Orders", value: "orders", icon: <MdOutlineShoppingBag size={18} />, badge: liveOrdersCount },
    { label: "Menu", value: "menu", icon: <MdOutlineMenuBook size={18} /> },
    { label: "Settings", value: "settings", icon: <MdOutlineSettings size={18} /> },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#fcfaf7] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Mobile Tab Bar */}
        <div className="lg:hidden flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          {mobileTabs.map((tab) => {
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-extrabold transition ${
                  active
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                    : "text-slate-600 hover:bg-orange-50"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    active ? "bg-white text-orange-600" : "bg-orange-100 text-orange-600"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar (Desktop) */}
          <div className="hidden lg:block w-72 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex-shrink-0 sticky top-24">
            <RestaurantSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              restaurantData={restaurantData}
              liveOrdersCount={liveOrdersCount}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full min-w-0">
            {activeTab === "overview" && (
              <RestaurantOverview
                onNavigateTab={(tab) => setActiveTab(tab)}
                onStatusUpdated={fetchRestaurantProfile}
              />
            )}
            {activeTab === "orders" && <RestaurantOrders />}
            {activeTab === "menu" && <RestaurantMenu />}
            {activeTab === "settings" && <RestaurantSetting />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;