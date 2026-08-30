import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { RiLoader4Fill } from "react-icons/ri";
import { IoSparkles, IoHeartOutline } from "react-icons/io5";
import api from "../config/api.config.js";

const Feedback = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: "",
    rating: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    "Food Quality & Taste",
    "Delivery Speed & Packaging",
    "App & Ordering Experience",
    "Canteen & Vendor Service",
    "Pricing & Student Discounts",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!data.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(data.email.trim()))
      newErrors.email = "Please enter valid email";
    if (!data.category) newErrors.category = "Please select category";
    if (!data.rating) newErrors.rating = "Please choose a star rating";
    if (!data.message.trim()) newErrors.message = "Please share your experience";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/public/feedback", {
        ...formData,
        email: formData.email.toLowerCase().trim(),
        rating: Number(formData.rating),
      });

      toast.success(response.data.message || "Thank you! Your feedback helps us serve you better.");
      setFormData({
        fullName: "",
        email: "",
        category: "",
        rating: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] py-12 sm:py-16 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6">
        <div className="rounded-[36px] bg-white border border-slate-200/80 p-8 sm:p-12 shadow-xl shadow-orange-950/5">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3.5 py-1 text-xs font-black text-orange-700 mb-4">
              <IoSparkles />
              <span>We Value Your Voice</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900">
              Share Your Feedback<span className="text-orange-600">.</span>
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2">
              Tell us about your campus dining, deliveries, and app experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Alex Morgan"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
              />
              {errors.fullName && <p className="text-red-500 text-xs font-bold mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="alex@campus.edu"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
              />
              {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-orange-500"
                >
                  <option value="">Select Topic</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs font-bold mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Overall Rating
                </label>
                <div className="flex items-center gap-1.5 pt-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => {
                        setFormData((p) => ({ ...p, rating: String(star) }));
                        if (errors.rating) setErrors((p) => ({ ...p, rating: "" }));
                      }}
                      className="p-1 focus:outline-hidden transform hover:scale-125 transition"
                    >
                      <FaStar
                        className={`text-2xl ${
                          Number(formData.rating) >= star
                            ? "text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && <p className="text-red-500 text-xs font-bold mt-1">{errors.rating}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Thoughts
              </label>
              <textarea
                name="message"
                rows={4}
                placeholder="What did you like? What can we do better?"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition resize-none"
              />
              {errors.message && <p className="text-red-500 text-xs font-bold mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 disabled:opacity-50 transition"
            >
              {loading ? (
                <>
                  <RiLoader4Fill className="animate-spin text-lg" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Experience Review</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
