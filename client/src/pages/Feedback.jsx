import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import api from "../config/ApiConfig";

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
        email: formData.email.toLowerCase(),
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
    `
  w-full
  rounded-xl
  border
  px-4
  py-3
  bg-slate-900/70
  text-white
  placeholder-slate-400
  outline-none
  focus:border-orange-400
  transition
  ${errors[field] ? "border-red-500" : "border-slate-600"}
  `;

  return (
    <div
      className="
min-h-screen
relative
flex
items-center
justify-center
bg-cover
bg-center
px-6
py-16
"
      style={{
        backgroundImage: "url('/FeedbackPage.jpeg')",
      }}
    >
      <div
        className="
absolute
inset-0
bg-black/70
"
      />

      <div
        className="
relative
z-10
w-full
max-w-xl
rounded-3xl
bg-white/10
backdrop-blur-xl
border
border-white/20
p-6
md:p-10
shadow-2xl
"
      >
        <h1
          className="
text-4xl
font-black
text-center
text-orange-400
"
        >
          Share Feedback
        </h1>

        <p
          className="
text-center
text-slate-300
mt-3
mb-8
"
        >
          Help us improve your Cravings experience.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className={inputClass("fullName")}
          />

          {errors.fullName && (
            <p className="text-red-400 text-sm">{errors.fullName}</p>
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className={inputClass("email")}
          />

          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email}</p>
          )}

          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={inputClass("category")}
          >
            <option value="">Select Feedback Category</option>

            {categories.map((category) => (
              <option key={category} value={category} className="text-black">
                {category}
              </option>
            ))}
          </select>

          {errors.category && (
            <p className="text-red-400 text-sm">{errors.category}</p>
          )}

          <div>
            <p className="text-white mb-2">Overall Rating</p>

            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      rating: star,
                    }))
                  }
                  className="
text-3xl
transition
"
                >
                  <FaStar
                    className={
                      Number(formData.rating) >= star
                        ? "text-yellow-400"
                        : "text-slate-500"
                    }
                  />
                </button>
              ))}
            </div>

            {errors.rating && (
              <p className="text-red-400 text-sm mt-2">{errors.rating}</p>
            )}
          </div>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell us about your experience..."
            rows="5"
            className={inputClass("message") + " resize-none"}
          />

          {errors.message && (
            <p className="text-red-400 text-sm">{errors.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
w-full
rounded-xl
bg-orange-500
py-3
font-bold
text-white
hover:bg-orange-600
transition
disabled:opacity-50
"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
