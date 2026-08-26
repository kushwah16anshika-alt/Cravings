import React, { useState } from "react";
import Sidebar from "../../components/userDashboard/Sidebar";
import Overview from "../../components/userDashboard/Overview";
import Order from "../../components/userDashboard/Order";
import Setting from "../../components/userDashboard/Setting";
import Wishlist from "../../components/userDashboard/Wishlist";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import foodTableImg from "../../assets/foodTable.webp";

const UserDashboard = () => {
  const { isLogin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "overview"
  );

  // Access Protection
  if (!isLogin || !user) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
          Please login to access your dashboard.
        </h1>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2.5 bg-(--color-primary) text-white font-semibold rounded-xl hover:bg-(--color-primary-focus) transition shadow-md"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (user.userType !== "user" && user.userType !== "customer") {
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
            This dashboard is dedicated to customer accounts. Please switch to your respective dashboard.
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
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 bg-(--color-base-100) p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto">
        {activeTab === "overview" && <Overview />}
        {activeTab === "orders" && <Order />}
        {activeTab === "wishlist" && <Wishlist />}
        {activeTab === "settings" && <Setting />}
      </div>
    </div>
  );
};

export default UserDashboard;