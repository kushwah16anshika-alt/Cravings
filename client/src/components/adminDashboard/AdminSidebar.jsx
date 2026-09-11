import React from "react";
import {
  MdOutlineDashboard,
  MdOutlineFastfood,
  MdOutlineStorefront,
  MdOutlinePeopleAlt,
  MdOutlineFeedback,
  MdOutlineSettings,
} from "react-icons/md";
import { IoShieldCheckmark } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    id: "overview",
    name: "Overview",
    icon: <MdOutlineDashboard size={20} />,
    badge: null,
  },
  {
    id: "orders",
    name: "Live Orders",
    icon: <MdOutlineFastfood size={20} />,
    badge: "Live",
  },
  {
    id: "restaurants",
    name: "Restaurants",
    icon: <MdOutlineStorefront size={20} />,
    badge: null,
  },
  {
    id: "users",
    name: "Users & Riders",
    icon: <MdOutlinePeopleAlt size={20} />,
    badge: null,
  },
  {
    id: "feedback",
    name: "Feedback Desk",
    icon: <MdOutlineFeedback size={20} />,
    badge: null,
  },
  {
    id: "settings",
    name: "Admin Profile",
    icon: <MdOutlineSettings size={20} />,
    badge: null,
  },
];

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const adminName = user?.fullName || user?.fullname || "Admin";

  return (
    <div className="flex flex-col h-full justify-between space-y-6">
      {/* Admin Profile Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-600/10 border border-orange-500/20">
          <div className="relative">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-base shadow-md shadow-orange-600/20">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[8px] ring-2 ring-white">
              ✓
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading text-sm font-black text-slate-900 truncate">
                {adminName}
              </h3>
              <IoShieldCheckmark className="text-orange-600 text-xs flex-shrink-0" />
            </div>
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full mt-0.5">
              Super Admin
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
            Navigation Menu
          </p>

          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 group ${
                  isActive
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/25 scale-[1.02]"
                    : "text-slate-600 hover:bg-orange-50/80 hover:text-orange-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-orange-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-orange-100 text-orange-600 group-hover:bg-orange-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer System Status Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            System Status
          </span>
          <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
            Operational
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
          Order pipeline and live payment webhook sync active.
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;