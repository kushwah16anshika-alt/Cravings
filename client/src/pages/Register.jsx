import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import image from "../assets/foodTable.webp";
import api from "../config/api.config.js";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { userType } = useParams();

  const [formData, setFormData] = useState({
    userType: userType || "user",
    fullname: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUserTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      userType: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to terms and conditions";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setLoading(true);

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    console.log("Form Data:", formData);

    try {
      const res = await api.post("/auth/register", {
        userType: formData.userType,
        fullname: formData.fullname,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        password: formData.password,
      });

      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred during registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-[url('/foodTable.webp')] flex items-center justify-end bg-cover bg-center p-10 py-12 md:pe-30">
      <div className="bg-white rounded-lg shadow-md px-10 py-6 max-w-md w-full">
        <h1 className="text-3xl font-bold text-(--color-primary) mb-2 text-center">
          Create Account
        </h1>

        <p className="text-(--color-secondary) text-center mb-4">
          Join us as a Customer, Restaurant, or Rider
        </p>

        <div className="mb-6">
          <label className="block text-(--color-neutral) font-semibold mb-3">
            Register as:
          </label>

         <div className="flex gap-5">
  {[
    { label: "Customer", value: "user" },
    { label: "Restaurant", value: "restaurant" },
    { label: "Rider", value: "rider" },
  ].map((type) => (
    <label
      key={type.value}
      className="flex items-center gap-2 cursor-pointer"
    >
      <input
        type="radio"
        name="userType"
        value={type.value}
        checked={formData.userType === type.value}
        onChange={handleUserTypeChange}
        className="cursor-pointer"
      />

      <span>{type.label}</span>
    </label>
  ))}
</div>
</div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.fullname ? "border-red-500 border-2" : ""
              }`}
            />

            {errors.fullname && (
              <span className="text-red-500 text-xs">
                {errors.fullname}
              </span>
            )}
          </div>

          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.email ? "border-red-500 border-2" : ""
              }`}
            />

            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email}
              </span>
            )}
          </div>

          <div className="mb-4">
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.phone ? "border-red-500 border-2" : ""
              }`}
            />

            {errors.phone && (
              <span className="text-red-500 text-xs">
                {errors.phone}
              </span>
            )}
          </div>
                    <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.gender ? "border-red-500 border-2" : ""
                }`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              {errors.gender && (
                <span className="text-red-500 text-xs">
                  {errors.gender}
                </span>
              )}
            </div>

            <div>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.dob ? "border-red-500 border-2" : ""
                }`}
              />

              {errors.dob && (
                <span className="text-red-500 text-xs">
                  {errors.dob}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.password ? "border-red-500 border-2" : ""
              }`}
            />

            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password}
              </span>
            )}
          </div>

          <div className="mb-6">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.confirmPassword ? "border-red-500 border-2" : ""
              }`}
            />

            {errors.confirmPassword && (
              <span className="text-red-500 text-xs">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="mb-6">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-1 cursor-pointer"
              />

              <span className="text-sm">
                I agree to the{" "}
                <span className="text-orange-500 hover:underline">
                  terms and conditions
                </span>
              </span>
            </label>

            {errors.agreeTerms && (
              <span className="text-red-500 text-xs ml-6">
                {errors.agreeTerms}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-500 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};



export default Register;