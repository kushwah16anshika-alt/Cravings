import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "../../components/adminDashboard/AdminSidebar";
import AdminOverview from "../../components/adminDashboard/AdminOverview";
import AdminOrders from "../../components/adminDashboard/AdminOrders";
import AdminRestaurants from "../../components/adminDashboard/AdminRestaurants";
import AdminUsers from "../../components/adminDashboard/AdminUsers";
import AdminFeedbacks from "../../components/adminDashboard/AdminFeedbacks";
import AdminSetting from "../../components/adminDashboard/AdminSetting";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

const AdminDashboard = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "overview"
  );

  // Access Protection
  if (!isLogin || role !== "admin") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-[#fcfaf7]">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 text-center max-w-md shadow-xl shadow-orange-950/5 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-orange-600 text-3xl shadow-xs">
            <IoShieldCheckmarkOutline />
          </div>

          <h1 className="font-heading text-2xl font-black text-slate-900">
            Administrator Access Required
          </h1>

          <p className="text-slate-500 text-xs font-medium leading-relaxed">
            Please log in with verified <strong>Admin credentials</strong> to access the platform command center and oversee platform food delivery operations.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 transition active:scale-95"
          >
            Sign In as Admin
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
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Main Tab Content Panel */}
          <div className="flex-1 w-full min-w-0">
            {activeTab === "overview" && (
              <AdminOverview onNavigateTab={(tab) => setActiveTab(tab)} />
            )}
            {activeTab === "orders" && <AdminOrders />}
            {activeTab === "restaurants" && <AdminRestaurants />}
            {activeTab === "users" && <AdminUsers />}
            {activeTab === "feedback" && <AdminFeedbacks />}
            {activeTab === "settings" && <AdminSetting />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
