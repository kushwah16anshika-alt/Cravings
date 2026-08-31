import React, { useState } from "react";
import {
  MdOutlineDashboard,
  MdOutlineShoppingBag,
  MdOutlineTwoWheeler,
  MdOutlineSettings,
} from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../config/api.config";
import toast from "react-hot-toast";

const RiderSidebar = ({ activeTab, setActiveTab }) => {
  const { user, setUser, setIsLogin, setRole } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);

  const tabs = [
    {
      name: "Overview",
      value: "overview",
      icon: <MdOutlineDashboard size={18} />,
    },
    {
      name: "Orders & Deliveries",
      value: "orders",
      icon: <MdOutlineShoppingBag size={18} />,
      count: 3,
    },
    {
      name: "Vehicle & Verification",
      value: "profile",
      icon: <MdOutlineTwoWheeler size={18} />,
    },
    {
      name: "Account Settings",
      value: "settings",
      icon: <MdOutlineSettings size={18} />,
    },
  ];

  const handleLogout = async () => {
    try {
      const res = await api.get("/auth/logout");
      toast.success(res.data?.message || "Logged out successfully");
      sessionStorage.removeItem("cravingUser");
      setUser(null);
      setIsLogin(false);
      setRole(null);
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const toggleAvailability = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      toast.success("Status: Online. Ready for orders.");
    } else {
      toast("Status: Offline. Orders paused.", { icon: "⏸️" });
    }
  };

  const userName = user?.fullName || user?.fullname || "Campus Rider";
  const userAvatar =
    user?.photo?.url ||
    "https://res.cloudinary.com/dpl3xwf1z/image/upload/v1783776802/circleLogo_z7icie.png";

  return (
    <aside className="h-full flex flex-col justify-between space-y-6">
      <div className="space-y-5">
        {/* Minimal Rider Profile Header */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={userAvatar}
                alt={userName}
                className="h-11 w-11 rounded-xl object-cover border border-slate-200 bg-white"
                onError={(e) => {
                  e.target.src =
                    "https://res.cloudinary.com/dpl3xwf1z/image/upload/v1783776802/circleLogo_z7icie.png";
                }}
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                  isOnline ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-sm font-bold text-slate-900 truncate">
                {userName}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Delivery Partner
              </p>
            </div>
          </div>

          {/* Minimal Status Toggle */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  isOnline ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              <span>{isOnline ? "Online" : "Offline"}</span>
            </span>

            <button
              onClick={toggleAvailability}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                isOnline
                  ? "bg-slate-200/80 text-slate-700 hover:bg-slate-300"
                  : "bg-orange-600 text-white hover:bg-orange-500"
              }`}
            >
              {isOnline ? "Go Offline" : "Go Online"}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
            Menu
          </p>

          {tabs.map((tab) => {
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${
                  active
                    ? "bg-orange-50 text-orange-600 font-bold border border-orange-200/70"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={active ? "text-orange-600" : "text-slate-400"}>
                    {tab.icon}
                  </span>
                  <span>{tab.name}</span>
                </div>

                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                      active
                        ? "bg-orange-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition border border-slate-200"
      >
        <HiOutlineLogout size={16} />
        <span>Sign Out</span>
      </button>
    </aside>
  );
};

export default RiderSidebar;