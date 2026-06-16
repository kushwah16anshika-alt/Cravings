import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar h-16 px-6 flex items-center justify-between shadow-md">
      
      <div className="text-3xl font-bold">
        Cravings
      </div>

      <div className="flex gap-6 text-lg font-medium">
        <Link to="/" className="hover:underline">
          Home
        </Link>

        <Link to="/contactus" className="hover:underline">
          Contact Us
        </Link>

        <Link to="/login" className="hover:underline">
          Login
        </Link>

        <Link to="/register" className="hover:underline">
          Register
        </Link>
      </div>

    </nav>
  );
};

export default Navbar;