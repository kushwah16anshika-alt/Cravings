import React, { useState } from "react";
import Sidebar from "../../components/userDashboard/Sidebar";
import Overview from "../../components/userDashboard/Overview";
import Order from "../../components/userDashboard/Order";
import Setting from "../../components/userDashboard/Setting";
import Wishlist from "../../components/userDashboard/Wishlist";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MdOutlineLock } from "react-icons/md";

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
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center bg-[#fcfaf7]">
        <div className="h-16 w-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center text-3xl mb-4">
          <MdOutlineLock />
        </div>
        <h1 className="font-heading text-2xl font-black text-slate-900 mb-2">
          Sign In Required
        </h1>
        <p className="text-xs text-slate-500 max-w-sm mb-6 font-medium">
          Please log into your account to view your past food orders, track active deliveries, and manage saved dishes.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 transition"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  if (user.userType !== "user" && user.userType !== "customer") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-[#fcfaf7]">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center max-w-md shadow-xl space-y-4">
          <h1 className="font-heading text-2xl font-black text-slate-900">
            Customer Dashboard
          </h1>
          <p className="text-slate-500 text-xs font-medium">
            You are currently signed in as a <strong>{user.userType}</strong>. Please switch to your respective partner dashboard.
          </p>
          <button
            onClick={() => {
              if (user.userType === "restaurant") navigate("/restaurant-dashboard");
              else if (user.userType === "rider") navigate("/rider-dashboard");
              else navigate("/admin-dashboard");
            }}
            className="w-full px-6 py-3 bg-orange-600 text-white font-extrabold text-xs rounded-2xl shadow-md hover:bg-orange-500 transition"
          >
            Go to Partner Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#fcfaf7] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-72 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex-shrink-0">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 w-full">
            {activeTab === "overview" && <Overview />}
            {activeTab === "orders" && <Order />}
            {activeTab === "wishlist" && <Wishlist />}
            {activeTab === "settings" && <Setting />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;