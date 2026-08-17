// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { FaPowerOff } from "react-icons/fa";
// import toast from "react-hot-toast";
// import api from "../config/api.config.js";
// import logoLight from "../assets/transparentLogoLight.png";

// const Navbar = () => {
//   const { user, isLogin, role, setUser, setIsLogin, setRole } = useAuth();

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
//     <nav className="sticky top-0 z-50 bg-gradient-to-r from-orange-500/90 via-orange-400/90 to-amber-400/90 backdrop-blur-xl border-b border-white/20 shadow-lg">
//       <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
//         {/* Logo */}
//         <Link
//           to="/"
//           className="transition-transform duration-300 hover:scale-105"
//         >
//           <img
//             src={logoLight}
//             alt="Cravings"
//             className="h-12 object-contain"
//           />
//         </Link>

//         {/* Right Section */}
//         {isLogin ? (
//           <div className="flex items-center gap-3">
//             {/* Profile */}
//             <button
//               onClick={handleNavigate}
//               className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-md hover:bg-white/20 hover:border-white/40 hover:shadow-xl transition-all duration-300"
//             >
//               <div className="relative">
//                 <img
//                   src={
//                     user?.photo?.url ||
//                     "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//                   }
//                   alt={user?.fullName}
//                   className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition duration-300"
//                 />

//                 <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white"></span>
//               </div>

//               <div className="hidden sm:flex flex-col text-left">
//                 <span className="font-semibold text-white text-sm">
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
//               className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-md hover:bg-white/20 hover:border-white/40 hover:shadow-xl transition-all duration-300"
//             >
//               <FaPowerOff className="group-hover:-rotate-90 transition-transform duration-300" />

//               <span className="hidden md:block font-medium">
//                 Logout
//               </span>
//             </button>
//           </div>
//         ) : (
//           <div className="flex items-center gap-3">
//             {/* Login */}
//             <Link
//               to="/login"
//               className="px-6 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold hover:bg-white/20 hover:border-white/40 transition-all duration-300"
//             >
//               Login
//             </Link>

//             {/* Register */}
//             <Link
//               to="/register/customer"
//               className="px-6 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold hover:bg-white/20 hover:border-white/40 transition-all duration-300"
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
import logoLight from "../assets/transparentLogoLight.png";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaPowerOff } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import api from "../config/ApiConfig";

const Navbar = () => {
  const { user, isLogin, role, setUser, setIsLogin, setRole } = useAuth();
  const { totalItems } = useCart();

  const navigate = useNavigate();

  // Navigate user to respective dashboard
  const handleNavigate = () => {
    if (role === "restaurant") {
      navigate("/restaurant-dashboard");
    } else if (role === "rider") {
      navigate("/rider-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/customer-dashboard");
    }
  };

  // Logout
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
          "Unknown error occurred during logout. Please try again.",
      );
    }
  };

  return (
    <>
      <div className="sticky top-0 z-99 flex items-center justify-between px-12 py-1 bg-(--color-primary) text-white w-full h-16 shadow-md">

        {/* ================= LOGO ================= */}
        <div className="h-full">
          <Link to="/">
            <img
              src={logoLight}
              alt="Cravings Logo"
              className="w-fit h-full"
            />
          </Link>
        </div>

        {/* ================= LOGGED IN ================= */}
        {isLogin ? (
          <div className="flex items-center gap-2">

            {/* ================= CART ================= */}
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => navigate("/cart")}
                className="hover:scale-110 transition-transform duration-200"
                title="Go to Cart"
              >
                <IoCartOutline className="text-(--color-primary-content) text-3xl" />
              </button>

              {/* Cart Count */}
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-(--color-error) text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>

            {/* ================= PROFILE ================= */}
            <button
              className="flex gap-2 items-center text-(--color-primary-content) border border-transparent hover:border-(--color-primary-content) px-3 py-1 rounded transition"
              title="Go to Dashboard"
              onClick={handleNavigate}
            >
              <img
                src={
                  user?.photo?.url ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={user?.fullName || "User"}
                className="w-12 h-12 rounded-full object-cover object-top"
              />

              <div className="flex flex-col items-start">
                <span className="text-base">
                  {user?.fullName || "User"}
                </span>

                <span className="text-xs text-(--color-primary-content)/80 uppercase">
                  {role}
                </span>
              </div>
            </button>

            {/* ================= LOGOUT ================= */}
            <button
              onClick={handleLogout}
              className="text-(--color-primary-content) border border-transparent hover:border-(--color-primary-content) hover:bg-(--color-error) px-3 py-3 rounded transition"
              title="Logout"
            >
              <FaPowerOff />
            </button>
          </div>
        ) : (

          /* ================= LOGGED OUT ================= */
          <div className="flex items-center gap-2">

            {/* Login */}
            <Link
              to="/login"
              className="text-(--color-primary-content) border border-transparent hover:border-(--color-primary-content) px-3 py-1 rounded transition"
            >
              Login
            </Link>

            {/* Register */}
            <Link
              to="/register/customer"
              className="bg-(--color-primary-content) text-(--color-primary) hover:bg-(--color-primary) hover:text-(--color-primary-content) border px-3 py-1 rounded transition"
            >
              Register
            </Link>

          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;