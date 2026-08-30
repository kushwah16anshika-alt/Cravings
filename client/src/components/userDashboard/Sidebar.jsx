import React from "react";
import {
  MdOutlineDashboard,
  MdOutlineShoppingBag,
  MdOutlineFavoriteBorder,
  MdOutlineSettings,
  MdOutlineRestaurant,
} from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../config/api.config";
import toast from "react-hot-toast";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, setUser, setIsLogin, setRole } = useAuth();
  const navigate = useNavigate();

  const mainTabs = [
    {
      name: "Dashboard Overview",
      value: "overview",
      icon: <MdOutlineDashboard size={20} />,
    },
    {
      name: "My Orders & History",
      value: "orders",
      icon: <MdOutlineShoppingBag size={20} />,
    },
    {
      name: "Saved & Wishlist",
      value: "wishlist",
      icon: <MdOutlineFavoriteBorder size={20} />,
    },
    {
      name: "Profile & Addresses",
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
      toast.error("Logout failed. Please try again.");
    }
  };

  const userName = user?.fullName || user?.fullname || "Student";
  const userPhoto =
    user?.photo?.url ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`;

  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div className="space-y-6">
        {/* User Mini Card */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-orange-50/70 border border-orange-100">
          <img
            src={userPhoto}
            alt={userName}
            className="h-11 w-11 rounded-xl object-cover ring-2 ring-orange-500/20"
          />
          <div className="min-w-0">
            <h3 className="font-heading text-sm font-black text-slate-900 truncate">
              {userName}
            </h3>
            <p className="text-[11px] font-bold text-orange-600 truncate">
              {user?.email || "Student Foodie"}
            </p>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3">
            Menu
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

        {/* Quick Order shortcut */}
        <div className="p-4 rounded-2xl bg-gradient-to-tr from-amber-500/10 to-orange-500/10 border border-orange-200/50 space-y-2">
          <p className="text-xs font-black text-slate-900">Craving something now?</p>
          <p className="text-[11px] font-semibold text-slate-500">Explore fresh campus menus</p>
          <button
            onClick={() => navigate("/order-now")}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 py-2 text-xs font-black text-white shadow-xs hover:bg-orange-500 active:scale-95 transition"
          >
            <MdOutlineRestaurant size={16} />
            <span>Order Food</span>
          </button>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-xs font-extrabold text-red-600 hover:bg-red-50 transition border border-red-100"
      >
        <HiOutlineLogout size={18} />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default Sidebar;