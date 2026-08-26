import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { RiLoader4Fill } from "react-icons/ri";
import api from "../config/api.config.js";
import feedbackBgImg from "../assets/images/FeedbackPage.jpeg";

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
    "Food Quality",
    "Delivery Experience",
    "App & Website",
    "Customer Support",
    "Pricing & Value",
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

    if (!data.rating) newErrors.rating = "Please select rating";

    if (!data.message.trim()) newErrors.message = "Please share your feedback";

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

      toast.success(response.data.message || "Feedback submitted successfully");

      setFormData({
        fullName: "",
        email: "",
        category: "",
        rating: "",
        message: "",
      });

      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-3 bg-slate-900/80 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-(--color-primary) transition text-sm ${
      errors[field] ? "border-red-500" : "border-slate-700"
    }`;

  return (
    <div
      className="min-h-screen relative flex items-center justify-center bg-cover bg-center px-6 py-16"
      style={{
        backgroundImage: `url(${feedbackBgImg})`,
      }}
    >
      <div className="absolute inset-0 bg-slate-950/80" />

      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-6 md:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-(--color-primary)/20 text-(--color-primary) border border-(--color-primary)/30 rounded-full mb-3">
            We Value Your Voice
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Share Your Feedback
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Help us improve your dining and ordering experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Alex Johnson"
              value={formData.fullName}
              onChange={handleInputChange}
              className={inputClass("fullName")}
            />
            {errors.fullName && (
              <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className={inputClass("email")}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={inputClass("category")}
              >
                <option value="" className="bg-slate-900">
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900">
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-xs mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Rating
              </label>
              <div className="flex items-center space-x-2 pt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => {
                      setFormData((p) => ({ ...p, rating: String(star) }));
                      if (errors.rating) setErrors((p) => ({ ...p, rating: "" }));
                    }}
                    className="p-1 focus:outline-none transition transform hover:scale-125"
                  >
                    <FaStar
                      className={`text-2xl ${
                        Number(formData.rating) >= star
                          ? "text-yellow-400"
                          : "text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-red-400 text-xs mt-1">{errors.rating}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Your Message
            </label>
            <textarea
              name="message"
              rows={4}
              placeholder="Tell us what you loved or how we can do better..."
              value={formData.message}
              onChange={handleInputChange}
              className={`${inputClass("message")} resize-none`}
            />
            {errors.message && (
              <p className="text-red-400 text-xs mt-1">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-(--color-primary) hover:bg-(--color-primary-focus) active:scale-[0.98] transition flex items-center justify-center space-x-2 shadow-lg shadow-(--color-primary)/30 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RiLoader4Fill className="animate-spin text-xl" />
                <span>Submitting Feedback...</span>
              </>
            ) : (
              <span>Submit Feedback</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
