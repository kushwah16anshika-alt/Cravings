import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoSparkles,
  IoPersonOutline,
  IoStorefrontOutline,
  IoBicycleOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { MdArrowForward } from "react-icons/md";
import api from "../config/api.config";
import { useAuth } from "../context/AuthContext";
import ForgotPasswordModal from "../components/commomModals/ForgotPasswordModal.jsx";
import foodBg from "../assets/images/fresh-gourmet-meal-beef-taco-salad-plate-generated-by-ai.jpg";

const DEMO_ACCOUNTS = [
  { label: "Customer", email: "customer1@gmail.com", pass: "Customer@123", icon: <IoPersonOutline /> },
  { label: "Restaurant", email: "manager1@gmail.com", pass: "Manager@123", icon: <IoStorefrontOutline /> },
  { label: "Rider", email: "rider1@gmail.com", pass: "Rider@123", icon: <IoBicycleOutline /> },
  { label: "Admin", email: "admin1@gmail.com", pass: "Admin@123", icon: <IoShieldCheckmarkOutline /> },
];

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsLogin, setRole } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFillDemo = (acc) => {
    setFormData({
      email: acc.email,
      password: acc.pass,
      rememberMe: false,
    });
    setErrors({});
    toast.success(`Loaded ${acc.label} credentials!`);
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.email.trim()) newErrors.email = "Email is required";
    if (!data.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      const userData = res.data?.data;
      setUser(userData);
      setRole(userData.userType);
      setIsLogin(true);

      toast.success(res.data?.message || "Welcome back to Cravings!");
      sessionStorage.setItem("cravingUser", JSON.stringify(userData));

      if (userData.userType === "restaurant") {
        navigate("/restaurant-dashboard");
      } else if (userData.userType === "rider") {
        navigate("/rider-dashboard");
      } else if (userData.userType === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/customer-dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#fcfaf7]">
        <div className="w-full max-w-5xl rounded-[36px] bg-white border border-slate-200/80 shadow-2xl shadow-orange-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Form Section */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 mb-6">
                <IoSparkles />
                <span>Welcome Back</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 mb-2">
                Log into Cravings<span className="text-orange-600">.</span>
              </h1>
              <p className="text-sm font-medium text-slate-500 mb-6">
                Enter your credentials to access your orders, favorites, and campus benefits.
              </p>

              {/* Quick Demo Login Pills */}
              <div className="mb-6 rounded-2xl bg-orange-50/70 border border-orange-100 p-3 space-y-2">
                <p className="text-[11px] font-black uppercase tracking-wider text-orange-800">
                  Quick Fill Demo Account:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.label}
                      type="button"
                      onClick={() => handleFillDemo(acc)}
                      className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl bg-white border border-orange-200 text-[11px] font-extrabold text-orange-700 shadow-xs hover:bg-orange-600 hover:text-white hover:border-orange-600 active:scale-95 transition"
                    >
                      <span>{acc.icon}</span>
                      <span>{acc.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600 text-lg" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="student@campus.edu"
                      className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-4 transition ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-bold text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordModalOpen(true)}
                      className="text-xs font-bold text-orange-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600 text-lg" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-11 py-3 rounded-2xl bg-slate-50 border text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-4 transition ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-bold text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 disabled:opacity-50 transition"
                >
                  <span>{loading ? "Signing in..." : "Sign In to Account"}</span>
                  <MdArrowForward size={18} />
                </button>
              </form>
            </div>

            {/* Bottom Register Redirect */}
            <div className="pt-6 border-t border-slate-100 text-center sm:text-left">
              <p className="text-xs font-semibold text-slate-500">
                Don't have a Cravings account?{" "}
                <Link to="/register" className="font-extrabold text-orange-600 hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Right Visual Image Showcase */}
          <div className="hidden lg:block lg:col-span-6 relative bg-slate-950 p-12 overflow-hidden">
            <img
              src={foodBg}
              alt="Gourmet Food"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-orange-300">
                  Campus Quick Bites
                </span>
              </div>

              <div className="space-y-4 max-w-sm">
                <h3 className="font-heading text-3xl font-black leading-tight">
                  Hot meals delivered straight to your study spot.
                </h3>
                <p className="text-xs font-medium text-slate-300">
                  Join thousands of students and campus staff enjoying seamless food ordering every day.
                </p>

                {/* Floating Glass Testimonial */}
                <div className="rounded-2xl glass-dark p-4 border border-white/10 shadow-xl">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://api.dicebear.com/7.x/bottts/svg?seed=Aarav"
                      alt="Student"
                      className="h-9 w-9 rounded-xl bg-orange-500/20"
                    />
                    <div>
                      <p className="text-xs font-black text-white">"Fastest food delivery on campus!"</p>
                      <p className="text-[10px] text-orange-400 font-bold">5.0 ★ Verified Student</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isForgotPasswordModalOpen && (
        <ForgotPasswordModal
          isOpen={isForgotPasswordModalOpen}
          onClose={() => setIsForgotPasswordModalOpen(false)}
        />
      )}
    </>
  );
};

export default Login;