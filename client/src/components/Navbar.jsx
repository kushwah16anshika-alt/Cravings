
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { FaPowerOff } from "react-icons/fa";
// import toast from "react-hot-toast";
// import api from "../config/api.config.js";

// import cravingLogo from "../assets/images/circleLogo-DpCri5UD.png";

// const Navbar = () => {
//   const {
//     user,
//     isLogin,
//     role,
//     setUser,
//     setIsLogin,
//     setRole,
//   } = useAuth();

//   const navigate = useNavigate();

//   const handleNavigate = () => {
//     if (role === "restaurant") {
//       navigate("/restaurant-dashboard");
//     } else if (role === "rider") {
//       navigate("/rider-dashboard");
//     } else if (role === "admin") {
//       navigate("/admin-dashboard");
//     } else {
//       navigate("/UserDashboard");
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const res = await api.get("/auth/logout");

//       toast.success(res.data.message);

//       sessionStorage.removeItem("UserData");
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
//     <div className="sticky top-0 z-50 flex items-center justify-between px-8 py-2 bg-orange-500 text-white shadow-md">
//       {/* Logo */}
//       <Link to="/">
//         <img
//           src={cravingLogo}
//           alt="Logo"
//           className="w-20 h-10 object-contain"
//         />
//       </Link>

//       {isLogin ? (
//         <div className="flex items-center gap-3">
//           <button
//             onClick={handleNavigate}
//             className="flex items-center gap-3 border border-transparent hover:border-white px-3 py-1 rounded transition"
//             title="Go to Dashboard"
//           >
//             <img
//               src={
//                 user?.photo?.url ||
//                 "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//               }
//               alt={user?.fullName}
//               className="w-12 h-12 rounded-full object-cover"
//             />

//             <div className="flex flex-col items-start">
//               <span className="text-base">{user?.fullName}</span>
//               <span className="text-xs uppercase">
//                 {role || "customer"}
//               </span>
//             </div>
//           </button>

//           <button
//             onClick={handleLogout}
//             className="border border-transparent hover:border-white hover:bg-red-500 p-3 rounded transition"
//             title="Logout"
//           >
//             <FaPowerOff />
//           </button>
//         </div>
//       ) : (
//         <div className="flex items-center gap-3">
//           <Link
//             to="/login"
//             className="hover:text-orange-500 hover:bg-white px-3 py-1 rounded transition"
//           >
//             Login
//           </Link>

//           <Link
//             to="/register"
//             className="bg-white text-orange-500 hover:bg-orange-600 hover:text-white px-3 py-1 rounded transition"
//           >
//             Register
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Navbar;


import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaPowerOff } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../config/ApiConfig";
import logoLight from "../assets/transparentLogoLight.png";

const Navbar = () => {
  const { user, isLogin, role, setUser, setIsLogin, setRole } = useAuth();

  const navigate = useNavigate();

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
          "Unknown error occurred during logout.",
      );
    }
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-12 py-1 bg-(--color-primary) text-white w-full h-16 shadow-md">
      <Link to="/" className="h-full">
        <img
          src={logoLight}
          alt="Logo"
          className="h-full w-fit object-contain"
        />
      </Link>

      {isLogin ? (
        <div className="flex items-center bg-white/10 hover:bg-white/20 border border-white/20 transition rounded-full pr-2 pl-1 py-1 shadow-lg">
          <button
            onClick={handleNavigate}
            className="flex items-center gap-3 cursor-pointer text-left"
          >
            <div className="relative">
              <img
                src={
                  user?.photo?.url ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={user?.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/40"
              />

              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-(--color-primary) rounded-full"></div>
            </div>

            <div className="flex flex-col mr-3">
              <span className="text-sm font-bold">
                {user?.fullName}
              </span>

              <span className="text-[10px] uppercase font-bold">
                {role}
              </span>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="hover:bg-red-500 p-2.5 rounded-full transition"
            title="Logout"
          >
            <FaPowerOff size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="px-3 py-1 rounded hover:bg-white hover:text-(--color-primary) transition"
          >
            Login
          </Link>

          <Link
            to="/register/customer"
            className="bg-white text-(--color-primary) px-3 py-1 rounded hover:bg-(--color-primary) hover:text-white border transition"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;