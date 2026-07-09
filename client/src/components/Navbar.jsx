// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { AiOutlineLogout } from "react-icons/ai";
// import api from "../config/api.config.js";
// import toast from "react-hot-toast";

// import cravingLogo from "../assets/images/circleLogo-DpCri5UD.png";

// const Navbar = () => {
//   const { user, setUser, isLogin, setIsLogin } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       const res = await api.get("/auth/logout");

//       sessionStorage.removeItem("UserData");
//       setIsLogin(false);
//       setUser(null);

//       toast.success(res.data.message);
//       navigate("/UserDashboard");
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   return (
//     <div className="bg-orange-500 text-white p-3 flex justify-between items-center">
//       {/* Logo */}
//       <Link to="/">
//         <img
//           src={cravingLogo}
//           alt="Logo"
//           className="w-20 h-10 object-contain"
//         />
//       </Link>

//       {/* Menu */}
//       <div className="flex gap-4 items-center">
//         <Link
//           to="/"
//           className="hover:text-orange-500 hover:bg-white px-3 py-1 rounded-sm transition-colors"
//         >
//           Home
//         </Link>

//         <Link
//           to="/contact-us"
//           className="hover:text-orange-500 hover:bg-white px-3 py-1 rounded-sm transition-colors"
//         >
//           Contact Us
//         </Link>

//         {/* Logged in user */}
//         {isLogin ? (
//           <div className="flex items-center gap-4 border-l border-white pl-4">
//             {/* <div className="w-8 h-8 rounded-full overflow-hidden">
//               <img
//                 src={user?.photo}
//                 alt="User"
//                 className="w-full h-full object-cover"
//               />
//             </div> */}
//             <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
//               <img
//                 src={
//                   user?.photo?.url ||
//                   "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//                 }
//                 alt="User"
//                 className="w-full h-full object-cover"
//               />

//             </div>
//             <Link to="/UserDashboard" className="hover:text-orange-200">
//               {user?.fullName}
//             </Link>

//             <button
//               onClick={handleLogout}
//               className="text-white hover:text-red-300 text-xl"
//             >
//               <AiOutlineLogout />
//             </button>
//           </div>
//         ) : (
//           <>
//             <Link
//               to="/login"
//               className="hover:text-orange-500 hover:bg-white px-3 py-1 rounded-sm transition-colors"
//             >
//               Login
//             </Link>

//             <Link
//               to="/register"
//               className="bg-white text-orange-500 px-3 py-1 rounded-sm hover:bg-orange-600 hover:text-white transition-colors"
//             >
//               Register
//             </Link>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;



import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaPowerOff } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../config/api.config.js";

import cravingLogo from "../assets/images/circleLogo-DpCri5UD.png";

const Navbar = () => {
  const {
    user,
    isLogin,
    role,
    setUser,
    setIsLogin,
    setRole,
  } = useAuth();

  const navigate = useNavigate();

  const handleNavigate = () => {
    if (role === "restaurant") {
      navigate("/restaurant-dashboard");
    } else if (role === "rider") {
      navigate("/rider-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/UserDashboard");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await api.get("/auth/logout");

      toast.success(res.data.message);

      sessionStorage.removeItem("UserData");
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
    <div className="sticky top-0 z-50 flex items-center justify-between px-8 py-2 bg-orange-500 text-white shadow-md">
      {/* Logo */}
      <Link to="/">
        <img
          src={cravingLogo}
          alt="Logo"
          className="w-20 h-10 object-contain"
        />
      </Link>

      {isLogin ? (
        <div className="flex items-center gap-3">
          <button
            onClick={handleNavigate}
            className="flex items-center gap-3 border border-transparent hover:border-white px-3 py-1 rounded transition"
            title="Go to Dashboard"
          >
            <img
              src={
                user?.photo?.url ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={user?.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />

            <div className="flex flex-col items-start">
              <span className="text-base">{user?.fullName}</span>
              <span className="text-xs uppercase">
                {role || "customer"}
              </span>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="border border-transparent hover:border-white hover:bg-red-500 p-3 rounded transition"
            title="Logout"
          >
            <FaPowerOff />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hover:text-orange-500 hover:bg-white px-3 py-1 rounded transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-white text-orange-500 hover:bg-orange-600 hover:text-white px-3 py-1 rounded transition"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;