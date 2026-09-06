import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import circleLogo from "../assets/images/circleLogo-DpCri5UD.png";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import {
  HiOutlineShoppingBag,
  HiOutlineMenuAlt3,
  HiOutlineX,
  HiOutlineLogout,
} from "react-icons/hi";
import {
  MdOutlineDashboard,
  MdOutlineStorefront,
  MdOutlineSupportAgent,
  MdOutlineEmail,
} from "react-icons/md";
import { IoSparklesOutline, IoSparkles, IoSearch } from "react-icons/io5";

import toast from "react-hot-toast";
import api from "../config/api.config.js";
import AISearchModal from "./AISearchModal";

const Navbar = () => {
  const { user, isLogin, role, setUser, setIsLogin, setRole } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Global Ctrl+K / Cmd+K shortcut listener for AI Search
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsAiModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Navigate user to respective dashboard
  const handleNavigateDashboard = () => {
    setMobileMenuOpen(false);
    if (role === "restaurant") {
      navigate("/restaurant-dashboard");
    } else if (role === "rider") {
      navigate("/rider-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/customer-dashboard");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      setMobileMenuOpen(false);
      const res = await api.get("/auth/logout");

      toast.success(res.data?.message || "Logged out successfully");
      sessionStorage.removeItem("cravingUser");

      setUser(null);
      setIsLogin(false);
      setRole(null);

      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(
        error.response?.data?.message || "Unable to logout. Please try again."
      );
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Explore Food", path: "/order-now", badge: "Hot" },
    { label: "Help & FAQs", path: "/help-center" },
    { label: "Contact", path: "/contact" },
  ];

  const userName = user?.fullName || user?.fullname || "User";
  const userPhoto =
    user?.photo?.url ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`;

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <nav className="glass-nav border-b border-orange-500/10 shadow-xs">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo Brand */}
          <Link
            to="/"
            className="group flex items-center gap-3 transition-transform duration-200 active:scale-95"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 p-2 shadow-md shadow-orange-500/20 group-hover:scale-105 transition">
              <img
                src={circleLogo}
                alt="Cravings Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-heading text-2xl font-extrabold tracking-tight text-slate-900">
              Cravings<span className="text-orange-600">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/70 p-1.5 shadow-xs backdrop-blur-md">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-orange-600 text-white shadow-sm shadow-orange-600/30"
                      : "text-slate-600 hover:bg-orange-50/80 hover:text-orange-600"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold uppercase ${
                        active
                          ? "bg-white text-orange-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Search Trigger Button (Desktop Pill) */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="hidden lg:flex items-center gap-2 rounded-2xl border border-orange-200/80 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/50 px-3.5 py-2 text-xs font-bold text-orange-700 shadow-2xs hover:border-orange-400 hover:shadow-xs transition active:scale-95 group"
              title="AI Smart Search (Ctrl + K)"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-orange-600 text-white shadow-xs">
                <IoSparkles size={12} className="animate-pulse" />
              </div>
              <span className="font-heading font-extrabold">Ask AI</span>
              <kbd className="rounded-md bg-white border border-orange-200/80 px-1.5 py-0.5 font-mono text-[10px] text-orange-800 shadow-2xs">
                Ctrl K
              </kbd>
            </button>

            {/* Mobile / Tablet AI Search Icon */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              title="AI Search (Ctrl + K)"
              className="flex lg:hidden h-11 w-11 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50/80 text-orange-600 shadow-xs transition hover:bg-orange-100 active:scale-95"
            >
              <IoSparkles size={20} className="animate-pulse" />
            </button>

            {/* Cart Shortcut Button */}
            <button
              onClick={() => navigate("/cart")}
              title="View Cart"
              className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-all duration-200 hover:border-orange-200 hover:bg-orange-50/60 hover:text-orange-600 active:scale-95"
            >
              <HiOutlineShoppingBag
                size={22}
                className="transition-transform duration-200 group-hover:scale-110"
              />
              {totalItems > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-1.5 text-[10px] font-extrabold text-white shadow-md shadow-orange-600/40 animate-pulse">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Logged in User Menu / Register Button */}
            {isLogin ? (
              <div className="flex items-center gap-2">
                {/* Profile Pill */}
                <button
                  onClick={handleNavigateDashboard}
                  title="Go to Dashboard"
                  className="group flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white py-1.5 pl-2 pr-3.5 shadow-xs transition-all duration-200 hover:border-orange-200 hover:bg-orange-50/40 active:scale-95"
                >
                  <div className="relative">
                    <img
                      src={userPhoto}
                      alt={userName}
                      className="h-8 w-8 rounded-xl object-cover ring-2 ring-orange-500/20"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                  </div>

                  <div className="hidden text-left sm:block">
                    <p className="max-w-[110px] truncate text-xs font-bold text-slate-800">
                      {userName}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="rounded bg-orange-100 px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider text-orange-600">
                        {role || "Customer"}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Quick Logout */}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                >
                  <HiOutlineLogout size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 transition hover:text-orange-600"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-orange-600/25 transition-all duration-200 hover:from-orange-500 hover:to-amber-500 hover:shadow-lg hover:shadow-orange-600/35 active:scale-95"
                >
                  <IoSparklesOutline size={16} />
                  <span>Get Started</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            >
              {mobileMenuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200/80 bg-white/95 px-4 py-6 shadow-xl backdrop-blur-xl md:hidden animate-float-slow">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold transition ${
                    isActive(link.path)
                      ? "bg-orange-600 text-white shadow-sm shadow-orange-600/30"
                      : "text-slate-700 hover:bg-orange-50"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-extrabold text-amber-950">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* Mobile AI Crave Search Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAiModalOpen(true);
                }}
                className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 p-3.5 text-white shadow-md shadow-orange-600/30 active:scale-95 transition"
              >
                <div className="flex items-center gap-2.5 font-heading font-extrabold text-sm">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/20">
                    <IoSparkles size={16} className="text-amber-200 animate-pulse" />
                  </div>
                  <span>Chef Crave AI Search</span>
                </div>
                <span className="rounded-lg bg-white/20 px-2 py-0.5 text-[11px] font-bold">
                  Open ✨
                </span>
              </button>

              <div className="my-2 border-t border-slate-100 pt-2" />

              {isLogin ? (
                <>
                  <button
                    onClick={handleNavigateDashboard}
                    className="flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3 text-left font-bold text-orange-700"
                  >
                    <MdOutlineDashboard size={20} />
                    <span>Open {role?.toUpperCase() || "USER"} Dashboard</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-left font-bold text-red-600 hover:bg-red-50"
                  >
                    <HiOutlineLogout size={20} />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full rounded-xl border border-slate-200 py-3 text-center font-bold text-slate-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full rounded-xl bg-orange-600 py-3 text-center font-extrabold text-white shadow-md shadow-orange-600/30"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Global AI Craving Search Modal */}
      <AISearchModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </header>
  );
};

export default Navbar;