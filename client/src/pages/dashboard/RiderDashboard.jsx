import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RiderSidebar from "../../components/riderDashboard/RiderSidebar";
import RiderOverview from "../../components/riderDashboard/RiderOverview";
import RiderOrders from "../../components/riderDashboard/RiderOrder";
import RiderSetting from "../../components/riderDashboard/RiderSetting";
import RiderProfileContainer from "../../components/riderDashboard/RiderProfile/coreDetails/Index";
import foodTableImg from "../../assets/foodTable.webp";

const RiderDashboard = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "overview"
  );

  if (!isLogin || role !== "rider") {
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
            Please log in as a registered Delivery Partner to view the rider dashboard.
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
      <div className="w-full md:w-64 lg:w-72 bg-(--color-base-100) p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0">
        <RiderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="flex-1 bg-(--color-base-100) p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto">
        {activeTab === "overview" && <RiderOverview />}
        {activeTab === "orders" && <RiderOrders />}
        {activeTab === "profile" && <RiderProfileContainer />}
        {activeTab === "settings" && <RiderSetting />}
      </div>
    </div>
  );
};

export default RiderDashboard;