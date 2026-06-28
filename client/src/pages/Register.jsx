import React, { useState } from "react";
import foodBg from "../assets/images/fresh-gourmet-meal-beef-taco-salad-plate-generated-by-ai.jpg";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    accountType: "customer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Register data submitted:", registerData);

    const payload = {
      fullname: registerData.fullname.trim(),
      email: registerData.email.toLowerCase(),
      password: registerData.password,
      accountType: registerData.accountType,
    };

    console.log("Payload:", payload);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-end bg-cover bg-center relative pr-16"
      style={{ backgroundImage: `url(${foodBg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Register Card */}
      <div className="relative w-[90%] max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8">

        <div className="text-center">
          <div className="mb-3 inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">
            Join Cravings
          </div>

          <h2 className="text-3xl font-bold text-orange-500">
            Create Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <input
            type="text"
            name="fullname"
            value={registerData.fullname}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="tel"
            name="phone"
            value={registerData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="password"
            name="password"
            value={registerData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="password"
            name="confirmPassword"
            value={registerData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* Terms */}
          <div className="flex items-center text-sm text-gray-600">
            <input type="checkbox" className="h-4 w-4" />
            <label className="ml-2">
              I agree to the{" "}
              <span className="text-orange-500 font-semibold cursor-pointer hover:underline">
                terms and conditions
              </span>
            </label>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition"
          >
            Register
          </button>

          {/* Login link */}
          <p className="text-center text-sm mt-3">
            Already registered?{" "}
            <a
              href="/login"
              className="text-orange-500 font-semibold hover:underline"
            >
              Login here
            </a>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;

