// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { FaPowerOff } from "react-icons/fa";
// import toast from "react-hot-toast";
// import api from "../config/api.config.js";
// import logoLight from "../assets/transparentLogoLight.png";

// const Navbar = () => {
//   const { user, isLogin, role, setUser, setIsLogin, setRole } = useAuth();
//   console.log("Navbar user:", user);
// console.log("Navbar role:", role);

//   const navigate = useNavigate();

//   const handleNavigate = () => {
//     switch (role) {
//       case "restaurant":
//         navigate("/restaurant-dashboard");
//         break;
//       case "rider":
//         navigate("/rider-dashboard");
//         break;
//       case "admin":
//         navigate("/admin-dashboard");
//         break;
//       default:
//         navigate("/customer-dashboard");
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const res = await api.get("/auth/logout");

//       toast.success(res.data.message);

//       sessionStorage.removeItem("cravingUser");
//       setUser(null);
//       setIsLogin(false);
//       setRole(null);

//       navigate("/");
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Unknown error occurred during logout."
//       );
//     }
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-orange-400 text-white shadow-lg">
//       <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
//         {/* Logo */}
//         <Link to="/" className="flex items-center">
//           <img
//             src={logoLight}
//             alt="Cravings"
//             className="h-12 w-auto object-contain"
//           />
//         </Link>

//         {/* Right Section */}
//         {isLogin ? (
//           <div className="flex items-center gap-4">
//             {/* Profile */}
//             <button
//               onClick={handleNavigate}
//               className="flex items-center gap-3 bg-orange-500 hover:bg-orange-700 transition-all duration-300 px-3 py-2 rounded-full shadow-md"
//             >
//               <div className="relative">
//                 <img
//                   src={
//                     user?.photo?.url ||
//                     "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//                   }
//                   alt={user?.fullName}
//                   className="w-11 h-11 rounded-full object-cover border-2 border-white"
//                 />

//                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-orange-600"></span>
//               </div>

//               <div className="hidden sm:flex flex-col text-left">
//                 <span className="font-semibold text-sm">
//                   {user?.fullName}
//                 </span>

//                 <span className="text-xs capitalize text-orange-100">
//                   {role}
//                 </span>
//               </div>
//             </button>

//             {/* Logout */}
//             <button
//               onClick={handleLogout}
//               title="Logout"
//               className="w-11 h-11 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-300 shadow-md"
//             >
//               <FaPowerOff size={18} />
//             </button>
//           </div>
//         ) : (
//           <div className="flex items-center gap-3">
//             {/* Login */}
//             <Link
//               to="/login"
//               className="px-5 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-orange-600 transition-all duration-300 font-medium"
//             >
//               Login
//             </Link>

//             {/* Register */}
//             <Link
//               to="/register/customer"
//               className="px-5 py-2 rounded-lg bg-white text-orange-600 hover:bg-orange-100 transition-all duration-300 font-semibold shadow-md"
//             >
//               Register
//             </Link>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaPowerOff } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../config/api.config.js";
import logoLight from "../assets/transparentLogoLight.png";

const Navbar = () => {
  const { user, isLogin, role, setUser, setIsLogin, setRole } = useAuth();

  const navigate = useNavigate();

  const handleNavigate = () => {
    switch (role) {
      case "restaurant":
        navigate("/restaurant-dashboard");
        break;
      case "rider":
        navigate("/rider-dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
      default:
        navigate("/customer-dashboard");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await api.get("/auth/logout");

      toast.success(res.data.message);

      sessionStorage.removeItem("cravingUser");
      setUser(null);
      setIsLogin(false);
      setRole(null);

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred during logout."
      );
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-orange-500/90 via-orange-400/90 to-amber-400/90 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link
          to="/"
          className="transition-transform duration-300 hover:scale-105"
        >
          <img
            src={logoLight}
            alt="Cravings"
            className="h-12 object-contain"
          />
        </Link>

        {/* Right Section */}
        {isLogin ? (
          <div className="flex items-center gap-3">
            {/* Profile */}
            <button
              onClick={handleNavigate}
              className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-md hover:bg-white/20 hover:border-white/40 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={
                    user?.photo?.url ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={user?.fullName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition duration-300"
                />

                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white"></span>
              </div>

              <div className="hidden sm:flex flex-col text-left">
                <span className="font-semibold text-white text-sm">
                  {user?.fullName}
                </span>

                <span className="text-xs capitalize text-orange-100">
                  {role}
                </span>
              </div>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-md hover:bg-white/20 hover:border-white/40 hover:shadow-xl transition-all duration-300"
            >
              <FaPowerOff className="group-hover:-rotate-90 transition-transform duration-300" />

              <span className="hidden md:block font-medium">
                Logout
              </span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* Login */}
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold hover:bg-white/20 hover:border-white/40 transition-all duration-300"
            >
              Login
            </Link>

            {/* Register */}
            <Link
              to="/register/customer"
              className="px-6 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold hover:bg-white/20 hover:border-white/40 transition-all duration-300"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;