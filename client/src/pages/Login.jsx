// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import foodBg from "../assets/images/fresh-gourmet-meal-beef-taco-salad-plate-generated-by-ai.jpg";
// import api from "../config/api.config";
// import toast from "react-hot-toast";

// const Login = () => {
//   const navigate = useNavigate();
//   const { setUser, setIsLogin } = useAuth();
// //use state first intialize value then track the changes
//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLoginData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       email: loginData.email.toLowerCase(),
//       password: loginData.password,
//     };

//     try {
//       const res = await api.post("/auth/login", payload);

//       toast.success(res.data.message);

//       // Save user data
//       sessionStorage.setItem(
//         "UserData",
//         JSON.stringify(res.data.data)
//       );

//       // Update Auth Context
//       setUser(res.data.data);
//       setIsLogin(true);

//       // Clear form
//       setLoginData({
//         email: "",
//         password: "",
//       });

//      navigate("/UserDashboard");
//     } catch (error) {
//       toast.error(
//         `${error.response?.status || ""} | ${
//           error.response?.data?.message || error.message
//         }`
//       );
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-start bg-cover bg-center relative pl-16"
//       style={{ backgroundImage: `url(${foodBg})` }}
//     >
//       <div className="absolute inset-0 bg-black/50"></div>

//       <div className="relative w-[90%] max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8">
//         <h2 className="text-3xl font-bold text-orange-500 text-center">
//           Welcome Back!
//         </h2>

//         <p className="text-center text-gray-600 mt-1">
//           Login to your craving account
//         </p>

//         <form onSubmit={handleSubmit} className="mt-6">
//           {/* Email */}
//           <div className="flex flex-col gap-2">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={loginData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="flex flex-col gap-2 mt-4">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={loginData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//               required
//             />
//           </div>

//           {/* Remember + Forgot */}
//           <div className="flex justify-between items-center mt-3 text-sm">
//             <label className="flex items-center gap-1">
//               <input type="checkbox" />
//               Remember me
//             </label>

//             <span className="text-orange-500 cursor-pointer hover:underline">
//               Forgot Password?
//             </span>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             className="w-full bg-orange-500 text-white py-3 rounded mt-5 hover:bg-orange-600 transition"
//           >
//             Login
//           </button>

//           {/* Register */}
//           <p className="text-center mt-5 text-sm">
//             Don't have an account?{" "}
//             <span
//               onClick={() => navigate("/register")}
//               className="text-orange-500 font-semibold cursor-pointer hover:underline"
//             >
//               Create account
//             </span>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import foodBg from "../assets/images/fresh-gourmet-meal-beef-taco-salad-plate-generated-by-ai.jpg";
import api from "../config/api.config";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsLogin, setRole } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.email.trim()) newErrors.email = "Email is required";
    if (!data.password) newErrors.password = "Password is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(loginData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = {
        email: loginData.email.toLowerCase(),
        password: loginData.password,
      };

      const res = await api.post("/auth/login", payload);

      toast.success(res.data.message);

      sessionStorage.setItem("UserData", JSON.stringify(res.data.data));

      setUser(res.data.data);
      setIsLogin(true);
      setRole(res.data.data.userType);

      setLoginData({
        email: "",
        password: "",
      });

      if (res.data.data.userType === "restaurant") {
        navigate("/restaurant-dashboard");
      } else if (res.data.data.userType === "rider") {
        navigate("/rider-dashboard");
      } else if (res.data.data.userType === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/UserDashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-start bg-cover bg-center relative pl-16"
      style={{ backgroundImage: `url(${foodBg})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative w-[90%] max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-orange-500 text-center">
          Welcome Back!
        </h2>

        <p className="text-center text-gray-600 mt-1">
          Login to your craving account
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>

            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.email ? "border-red-500 border-2" : ""
              }`}
              required
            />

            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 mt-4">
            <label htmlFor="password">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errors.password ? "border-red-500 border-2" : ""
                }`}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password}
              </span>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center mt-3 text-sm">
            <label className="flex items-center gap-1">
              <input type="checkbox" />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="text-orange-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded mt-5 hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register */}
          <p className="text-center mt-5 text-sm">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-orange-500 font-semibold cursor-pointer hover:underline"
            >
              Create account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;