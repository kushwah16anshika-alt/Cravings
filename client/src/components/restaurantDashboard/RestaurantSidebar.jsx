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

const RestaurantSidebar = ({ activeTab, setActiveTab }) => {
  const { user, setUser, setIsLogin, setRole } = useAuth();
  const navigate = useNavigate();

  const mainTabs = [
    {
      name: "Kitchen Overview",
      value: "overview",
      icon: <MdOutlineDashboard size={20} />,
    },
    {
      name: "Live Orders",
      value: "orders",
      icon: <MdOutlineShoppingBag size={20} />,
    },
    {
      name: "Menu & Dishes",
      value: "menu",
      icon: <MdOutlineMenuBook size={20} />,
    },
    {
      name: "Store Profile",
      value: "settings",
      icon: <MdOutlineSettings size={20} />,
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
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const userName = user?.fullName || user?.fullname || "Kitchen Partner";

  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div className="space-y-6">
        {/* Restaurant Mini Header */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-orange-500/10 border border-orange-200">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-xs">
            <MdOutlineStorefront size={22} />
          </div>
          <div className="min-w-0">
            <h3 className="font-heading text-sm font-black text-slate-900 truncate">
              {userName}
            </h3>
            <span className="inline-block text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.2 rounded-full">
              Partner Hub
            </span>
          </div>
        </div>

        {/* Tab Links */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3">
            Management
          </p>
          {mainTabs.map((tab) => {
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 text-left ${
                  active
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/30 scale-102"
                    : "text-slate-700 hover:bg-orange-50/80 hover:text-orange-600"
                }`}
              >
                <span className={active ? "text-white" : "text-orange-600"}>
                  {tab.icon}
                </span>
                <span>{tab.name}</span>
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