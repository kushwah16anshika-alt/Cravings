import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RestaurantSidebar from "../../components/restaurantDashboard/RestaurantSidebar";
import RestaurantOverview from "../../components/restaurantDashboard/RestaurantOverview";
import RestaurantMenu from "../../components/restaurantDashboard/RestaurantMenu";
import RestaurantOrders from "../../components/restaurantDashboard/RestaurantOrders";
import RestaurantSetting from "../../components/restaurantDashboard/RestaurantSetting";

const RestaurantDashboard = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "overview"
  );

  if (!isLogin || role !== "restaurant") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-[#fcfaf7]">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center max-w-md shadow-xl space-y-4">
          <span className="text-4xl">🧑‍🍳</span>
          <h1 className="font-heading text-2xl font-black text-slate-900">
            Restaurant Partner Portal
          </h1>
          <p className="text-slate-500 text-xs font-medium">
            Please log in with a Restaurant Partner account to manage menu items, receive live campus orders, and update kitchen timings.
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

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#fcfaf7] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <div className="w-full lg:w-72 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex-shrink-0">
            <RestaurantSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full">
            {activeTab === "overview" && <RestaurantOverview />}
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