import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logoLight from "../assets/transparentLogoLight.png";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import { FaPowerOff } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";

import toast from "react-hot-toast";
import api from "../config/api.config.js";

const Navbar = () => {
  const {
    user,
    isLogin,
    role,
    setUser,
    setIsLogin,
    setRole,
  } = useAuth();

  const { totalItems } = useCart();
  const navigate = useNavigate();

  // Navigate user to respective dashboard
  const handleNavigate = () => {
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

  const userPhoto =
    user?.photo?.url ||
    `https://placehold.co/100x100?text=${(user?.fullname || user?.fullName || "U").charAt(0).toUpperCase()}`;

  const userName = user?.fullName || user?.fullname || "User";

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="w-full border-b border-orange-600 bg-orange-500 shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            className="flex h-12 items-center transition-transform duration-200 hover:scale-105"
          >
            <img
              src={logoLight}
              alt="Cravings Logo"
              className="h-full w-auto object-contain"
            />
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-semibold text-white/90">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <Link to="/order-now" className="hover:text-white transition">
              Explore Menu
            </Link>
            <Link to="/contact" className="hover:text-white transition">
              Contact Us
            </Link>
            <Link to="/help-center" className="hover:text-white transition">
              Help
            </Link>
          </div>

          {/* User Section */}
          {isLogin ? (
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Cart Button */}
              <button
                onClick={() => navigate("/cart")}
                title="Cart"
                className="group relative flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-orange-600"
              >
                <IoCartOutline
                  size={26}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white shadow-md animate-pulse">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>

              {/* Profile / Dashboard Button */}
              <button
                onClick={handleNavigate}
                title="Open Dashboard"
                className="group flex items-center gap-2.5 rounded-full border border-white/30 bg-orange-600/40 px-2 py-1 pr-3.5 transition-all duration-200 hover:border-white/60 hover:bg-orange-700"
              >
                <div className="relative">
                  <img
                    src={userPhoto}
                    alt={userName}
                    className="h-8 w-8 rounded-full border border-white object-cover object-top"
                  />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-orange-500 bg-green-400" />
                </div>

                <div className="hidden text-left sm:block">
                  <p className="max-w-28 truncate text-xs font-bold text-white">
                    {userName}
                  </p>
                  <div className="flex items-center gap-1">
                    <MdDashboard size={11} className="text-white/80" />
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-white/80">
                      {role || "user"}
                    </span>
                  </div>
                </div>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-200 hover:border-red-500 hover:bg-red-500"
              >
                <FaPowerOff
                  size={14}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-white px-5 py-2 text-sm font-bold text-orange-600 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-50 hover:shadow-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;