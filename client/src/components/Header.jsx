import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/craving.png";

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg py-3 px-3 fixed-top shadow custom-navbar">
        <div className="container-fluid">

          <Link className="navbar-brand" to="/">
            <img
              src={logo}
              alt="Cravings Logo"
              width="70"
              className="img-fluid"
            />
          </Link>

          <div className="ms-auto d-flex align-items-center">

            <Link to="/login" className="text-decoration-none">
              <button className="text-light bg-transparent border-0 fs-6 me-3">
                Login
              </button>
            </Link>

            <Link to="/register" className="text-decoration-none">
              <button className="btn btn-hero-primary bg-white">
                Register
              </button>
            </Link>

          </div>

        </div>
      </nav>
    </header>
  );
};

export default Header;