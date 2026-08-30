import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLoader4Fill } from "react-icons/ri";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoLockClosedOutline,
  IoCalendarOutline,
  IoSparkles,
  IoStorefrontOutline,
  IoBicycleOutline,
} from "react-icons/io5";
import { MdArrowForward } from "react-icons/md";
import api from "../config/api.config.js";
import foodBg from "../assets/images/fresh-gourmet-meal-beef-taco-salad-plate-generated-by-ai.jpg";

const Register = () => {
  const { userType } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userType: userType || "user",
    fullname: "",
    email: "",
    phone: "",
    gender: "male",
    dob: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.fullname.trim()) newErrors.fullname = "Full name is required";

    if (!data.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(data.email.trim()))
      newErrors.email = "Please enter a valid email";

    if (!data.phone.trim()) newErrors.phone = "Phone number is required";
    if (!data.gender) newErrors.gender = "Gender is required";
    if (!data.dob) newErrors.dob = "Date of birth is required";

    if (!data.password || data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!data.agreeTerms) {
      newErrors.agreeTerms = "You must agree to terms and conditions";
    }

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
      const res = await api.post("/auth/register", {
        userType: formData.userType,
        fullname: formData.fullname.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        dob: formData.dob,
        password: formData.password,
      });

      toast.success(res.data.message || "Registration successful! Please sign in.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed. Please verify your details."
      );
    } finally {
      setLoading(false);
    }
  };

  const roleCards = [
    { type: "user", label: "Student / Customer", icon: <IoPersonOutline size={18} /> },
    { type: "restaurant", label: "Restaurant Partner", icon: <IoStorefrontOutline size={18} /> },
    { type: "rider", label: "Delivery Partner", icon: <IoBicycleOutline size={18} /> },
  ];

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#fcfaf7]">
      <div className="w-full max-w-5xl rounded-[36px] bg-white border border-slate-200/80 shadow-2xl shadow-orange-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Form Section */}
        <div className="lg:col-span-7 p-8 sm:p-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 mb-4">
            <IoSparkles />
            <span>Join the Food Revolution</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            Create Your Account<span className="text-orange-600">.</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mb-6">
            Get instant access to campus dining, live discounts, and fast delivery.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                I am registering as:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roleCards.map((rc) => {
                  const selected = formData.userType === rc.type;
                  return (
                    <button
                      key={rc.type}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, userType: rc.type }))}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-200 ${
                        selected
                          ? "bg-orange-50 border-orange-500 text-orange-700 shadow-xs font-extrabold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold"
                      }`}
                    >
                      <span className={selected ? "text-orange-600 mb-1" : "text-slate-400 mb-1"}>
                        {rc.icon}
                      </span>
                      <span className="text-[11px] leading-tight">{rc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2-col inputs: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <IoPersonOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600 text-base" />
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    placeholder="Alex Morgan"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
                  />
                </div>
                {errors.fullname && <p className="text-[11px] font-bold text-red-500 mt-1">{errors.fullname}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <IoMailOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600 text-base" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="alex@campus.edu"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
                  />
                </div>
                {errors.email && <p className="text-[11px] font-bold text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* 3-col inputs: Phone, Gender, DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <IoCallOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600 text-base" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-2 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-orange-500"
                  />
                </div>
                {errors.phone && <p className="text-[11px] font-bold text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-orange-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-orange-500"
                />
                {errors.dob && <p className="text-[11px] font-bold text-red-500 mt-1">{errors.dob}</p>}
              </div>
            </div>

            {/* 2-col Password inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <IoLockClosedOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600 text-base" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] font-bold text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <IoLockClosedOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600 text-base" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[11px] font-bold text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
              />
              <label htmlFor="agreeTerms" className="text-xs font-semibold text-slate-600 cursor-pointer">
                I agree to the <span className="text-orange-600 underline">Terms of Service</span> & <span className="text-orange-600 underline">Privacy Policy</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 disabled:opacity-50 transition"
            >
              <span>{loading ? "Creating Account..." : "Create Free Account"}</span>
              <MdArrowForward size={18} />
            </button>
          </form>

          <div className="pt-6 mt-6 border-t border-slate-100 text-center sm:text-left">
            <p className="text-xs font-semibold text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-extrabold text-orange-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="hidden lg:block lg:col-span-5 relative bg-slate-950 p-10 overflow-hidden">
          <img
            src={foodBg}
            alt="Gourmet Platter"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          <div className="relative z-10 h-full flex flex-col justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                Join 500k+ Students
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-3xl font-black leading-tight">
                Unlock exclusive student perks & priority delivery.
              </h3>
              <ul className="space-y-2 text-xs font-semibold text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-orange-400 font-bold">✓</span> No minimum order values
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-400 font-bold">✓</span> Instant campus delivery under 25 mins
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-400 font-bold">✓</span> Exclusive canteen discounts & combo meals
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;