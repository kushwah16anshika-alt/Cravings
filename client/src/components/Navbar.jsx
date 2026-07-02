// import React from "react";
// import { Link } from "react-router-dom";
// import cravingLogo from "../assets/images/circleLogo-DpCri5UD.png"; // Kept your local logo path verified from your directory image

// const Navbar = () => {
//   return (
//     <div className="bg-orange-500 text-white p-3 flex justify-between items-center">
//       <div className="flex items-center gap-2">
//         <span>
//           <Link to="/">
//             <img src={cravingLogo} alt="Logo" className="w-20 h-10 object-contain" />
//           </Link>
//         </span>
//       </div>

//       <div className="flex gap-3">
//         {/* Converted to a Router Link targeting /login */}
//         <Link 
//           to="/login" 
//           className="bg-transparent text-white px-3 py-1 rounded-sm hover:text-orange-500 hover:bg-white inline-block text-center transition-colors"
//         >
//           Login
//         </Link>

//         {/* Converted to a Router Link targeting /register */}
//         <Link 
//           to="/register" 
//           className="bg-white text-orange-500 px-3 py-1 rounded-sm hover:text-white hover:bg-orange-500 inline-block text-center transition-colors"
//         >
//           Register
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Navbar;


import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import cravingLogo from "../assets/images/circleLogo-DpCri5UD.png";
import { AiOutlineLogout } from "react-icons/ai";

const Navbar = () => {
  const { user, setUser, isLogin, setIsLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("UserData");
    setIsLogin(false);
    setUser(false);
    navigate("/");
  };

  return (
    <div className="bg-orange-500 text-white p-3 flex justify-between items-center">
      <Link to="/">
        <img
          src={cravingLogo}
          alt="Logo"
          className="w-20 h-10 object-contain"
        />
      </Link>

      <div className="flex gap-4 items-center">
        <Link
          to="/"
          className="hover:text-orange-500 hover:bg-white px-3 py-1 rounded-sm transition-colors"
        >
          Home
        </Link>

        <Link
          to="/contactus"
          className="hover:text-orange-500 hover:bg-white px-3 py-1 rounded-sm transition-colors"
        >
          Contact Us
        </Link>

        {isLogin ? (
          <div className="flex items-center gap-4 border-l border-white pl-4">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={user?.photo}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>

            <Link
              to="/user/dashboard"
              className="hover:text-orange-200"
            >
              {user?.fullName}
            </Link>

            <button
              onClick={handleLogout}
              className="text-white hover:text-red-300 text-xl"
            >
              <AiOutlineLogout />
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-orange-500 hover:bg-white px-3 py-1 rounded-sm transition-colors"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-white text-orange-500 px-3 py-1 rounded-sm hover:bg-orange-600 hover:text-white transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;