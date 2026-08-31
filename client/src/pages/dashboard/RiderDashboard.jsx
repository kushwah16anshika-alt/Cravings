import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RiderSidebar from "../../components/riderDashboard/RiderSidebar";
import RiderOverview from "../../components/riderDashboard/RiderOverview";
import RiderOrders from "../../components/riderDashboard/RiderOrder";
import RiderSetting from "../../components/riderDashboard/RiderSetting";
import RiderProfileView from "../../components/riderDashboard/RiderProfile/RiderProfileView";
import { IoBicycleOutline, IoSparkles } from "react-icons/io5";
import { MdOutlineLock } from "react-icons/md";

const RiderDashboard = () => {
  const { isLogin, role, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "overview"
  );

  // Access Protection
  if (!isLogin || role !== "rider") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-[#fcfaf7]">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 text-center max-w-md shadow-xl shadow-orange-950/5 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-orange-600 text-3xl shadow-xs">
            <IoBicycleOutline />
          </div>

          <h1 className="font-heading text-2xl font-black text-slate-900">
            Delivery Partner Portal
          </h1>

          <p className="text-slate-500 text-xs font-medium leading-relaxed">
            Please log in with a registered <strong>Campus Delivery Partner</strong> account to access active orders, accept pickup requests, and manage your shift.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 transition active:scale-95"
          >
            Sign In as Delivery Partner
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
            <RiderSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Main Tab Content Panel */}
          <div className="flex-1 w-full">
            {activeTab === "overview" && <RiderOverview />}
            {activeTab === "orders" && <RiderOrders />}
            {activeTab === "profile" && <RiderProfileView />}
            {activeTab === "settings" && <RiderSetting />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;