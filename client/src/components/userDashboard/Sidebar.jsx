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
      name: "Overview",
      value: "overview",
      icon: <MdOutlineDashboard size={18} />,
    },
    {
      name: "Orders & History",
      value: "orders",
      icon: <MdOutlineShoppingBag size={18} />,
    },
    {
      name: "Saved & Wishlist",
      value: "wishlist",
      icon: <MdOutlineFavoriteBorder size={18} />,
    },
    {
      name: "Profile & Addresses",
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
      <div className="space-y-5">
        {/* User Mini Card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/60 border border-orange-100/80">
          <img
            src={userPhoto}
            alt={userName}
            className="h-10 w-10 rounded-xl object-cover ring-2 ring-orange-500/20"
          />
          <div className="min-w-0">
            <h3 className="font-heading text-xs font-bold text-slate-900 truncate">
              {userName}
            </h3>
            <p className="text-[11px] font-semibold text-orange-600 truncate">
              {user?.email || "Customer"}
            </p>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
            Menu
          </p>
          {mainTabs.map((tab) => {
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 text-left ${
                  active
                    ? "bg-orange-600 text-white shadow-sm shadow-orange-600/30"
                    : "text-slate-600 hover:bg-orange-50/80 hover:text-orange-600"
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
        <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-100/70 space-y-2">
          <p className="text-xs font-bold text-slate-900">Craving food?</p>
          <p className="text-[11px] font-medium text-slate-500">Explore fresh campus menus</p>
          <button
            onClick={() => navigate("/order-now")}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-orange-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-500 active:scale-98 transition"
          >
            <MdOutlineRestaurant size={15} />
            <span>Order Food</span>
          </button>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50/60 transition border border-slate-200/80"
      >
        <HiOutlineLogout size={16} />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default Sidebar;