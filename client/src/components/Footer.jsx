import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoCircle from "../assets/images/circleLogo-DpCri5UD.png";

const Footer = () => {
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Hide footer on dashboard pages
  if (location.toLowerCase().includes("dashboard")) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Tagline */}
        <div className="text-center mb-10">
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
            Your favorite food delivery platform connecting food lovers with top restaurants and swift riders.
          </p>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Logo & Brand */}
          <div className="flex flex-col items-start">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-xl"></div>
              <img
                src={logoCircle}
                alt="Cravings Logo"
                className="relative w-24 h-24 object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Fresh flavors delivered straight to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-(--color-primary) transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/order-now" className="hover:text-(--color-primary) transition">
                  Order Now
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-(--color-primary) transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Restaurants */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Restaurants
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/register/restaurant" className="hover:text-(--color-primary) transition">
                  Partner with Us
                </Link>
              </li>
              <li>
                <Link to="/restaurant-dashboard" className="hover:text-(--color-primary) transition">
                  Restaurant Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* For Riders */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Delivery
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/register/rider" className="hover:text-(--color-primary) transition">
                  Become a Rider
                </Link>
              </li>
              <li>
                <Link to="/rider-dashboard" className="hover:text-(--color-primary) transition">
                  Rider Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Feedback */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/feedback" className="hover:text-(--color-primary) transition">
                  Submit Feedback
                </Link>
              </li>
              <li>
                <Link to="/help-center" className="hover:text-(--color-primary) transition">
                  Help Center & FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p className="mb-4 md:mb-0">
            &copy; {currentYear} Cravings. All rights reserved.
          </p>

          <div className="flex gap-6">
            <span className="hover:text-slate-400 transition cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-slate-400 transition cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-slate-400 transition cursor-pointer">
              Security
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;