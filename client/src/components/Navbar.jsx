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
import { Link } from "react-router-dom";
import cravingLogo from "../assets/images/circleLogo-DpCri5UD.png";

const Navbar = () => {
  return (
    <div className="bg-orange-500 text-white p-3 flex justify-between items-center">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link to="/">
          <img
            src={cravingLogo}
            alt="Logo"
            className="w-20 h-10 object-contain"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-4 items-center text-sm font-medium">

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

        <Link
          to="/login"
          className="bg-transparent text-white px-3 py-1 rounded-sm hover:text-orange-500 hover:bg-white transition-colors"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-white text-orange-500 px-3 py-1 rounded-sm hover:text-white hover:bg-orange-500 transition-colors"
        >
          Register
        </Link>

      </div>
    </div>
  );
};

export default Navbar;