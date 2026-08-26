import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RestaurantSidebar from "../../components/restaurantDashboard/RestaurantSidebar";
import RestaurantOverview from "../../components/restaurantDashboard/RestaurantOverview";
import RestaurantMenu from "../../components/restaurantDashboard/RestaurantMenu";
import RestaurantOrders from "../../components/restaurantDashboard/RestaurantOrders";
import RestaurantSetting from "../../components/restaurantDashboard/RestaurantSetting";
import foodTableImg from "../../assets/foodTable.webp";

const RestaurantDashboard = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "menu"
  );

  if (!isLogin || role !== "restaurant") {
    return (
      <div
        className="min-h-[85vh] bg-cover bg-center flex items-center justify-center p-6"
        style={{ backgroundImage: `url(${foodTableImg})` }}
      >
        <div className="p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-white/10 text-center max-w-md shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-2">
            Access Denied
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            Please log in as a Restaurant Manager to view the restaurant partner portal.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 bg-(--color-primary) text-white font-semibold rounded-xl hover:bg-(--color-primary-focus) transition shadow-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row gap-4 p-4 max-w-7xl mx-auto">
      {/* Sidebar */}
      <div className="w-full md:w-64 lg:w-72 bg-(--color-base-100) p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0">
        <RestaurantSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-(--color-base-100) p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto">
        {activeTab === "overview" && <RestaurantOverview />}
        {activeTab === "orders" && <RestaurantOrders />}
        {activeTab === "settings" && <RestaurantSetting />}
        {activeTab === "menu" && <RestaurantMenu />}
      </div>
    </div>
  );
};

export default RestaurantDashboard;