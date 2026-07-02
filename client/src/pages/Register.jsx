import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "../assets/images/craving.png";
import api from "../config/api.config.js";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    gender: "",
    dob: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [validateError, setValidateError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      setValidateError("Passwords do not match");
      return;
    }

    setValidateError("");

    const payload = {
      fullName: registerData.fullName,
      email: registerData.email.toLowerCase(),
      gender: registerData.gender,
      dob: registerData.dob,
      phone: registerData.phone,
      password: registerData.password,
    };

    try {
      const res = await api.post("/auth/register", payload);

      toast.success(res.data.message);

      setRegisterData({
        fullName: "",
        email: "",
        gender: "",
        dob: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/login");
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Registration failed";

      console.log(msg);

      setValidateError(msg);
      toast.error(msg);
    }
  };

  const inputClass =
    "border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        <div className="hidden md:flex items-center justify-center bg-orange-100">
          <img src={image} alt="Craving" className="w-4/5 object-contain" />
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-3xl font-bold text-orange-500 text-center">
            Create an Account
          </h2>

          <p className="text-center text-gray-500 mt-2">
            Join Cravings today!
          </p>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-6">

            <div className="col-span-2 flex flex-col gap-2">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={registerData.fullName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={registerData.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Gender</label>
              <select
                name="gender"
                value={registerData.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={registerData.dob}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {validateError && (
              <p className="text-red-500 text-sm col-span-2">
                {validateError}
              </p>
            )}

            <button
              type="submit"
              className="col-span-2 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
            >
              Register
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-orange-500 font-semibold hover:underline"
              >
                Login here
              </button>
            </p>

            <p className="text-sm mt-2">
              Having Trouble?{" "}
              <button
                type="button"
                onClick={() => navigate("/contactus")}
                className="text-orange-500 font-semibold hover:underline"
              >
                Contact Us
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;