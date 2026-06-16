import React, { useState } from "react";
import deliveryboy from "./deliverypng.png";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      email: loginData.email.toLowerCase(),
      password: loginData.password,
    };

    console.log(payload);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl w-full">
        
        {/* Image Section */}
        <div className="hidden md:flex justify-center">
          <img
            src={deliveryboy}
            alt="Delivery Boy"
            className="w-96"
          />
        </div>

        {/* Login Card */}
        <div
          className="p-8 rounded-xl shadow-lg"
          style={{ backgroundColor: "white" }}
        >
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text)" }}
          >
            Welcome Back!
          </h1>

          <p className="mb-6 text-gray-600">
            Login to your account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 font-medium"
              >
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full border p-3 rounded-lg outline-none"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 font-medium"
              >
                Password
              </label>

              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full border p-3 rounded-lg outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold transition-all"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--text)",
              }}
            >
              Login
            </button>
          </form>

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <span
              className="font-semibold cursor-pointer"
              style={{ color: "var(--accent)" }}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;