import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoCircle from "../assets/circleLogo.png";

const Footer = () => {
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  if (location.toLowerCase().includes("dashboard")) return null;

  return (
    <footer className="bg-(--color-neutral) text-(--color-neutral-content) py-8">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-sm text-center mb-8">
          --- Your favorite food delivery platform connecting customers with
          restaurants and riders. ---
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <img
              src={logoCircle}
              alt="Cravings Logo"
              className="w-32 h-32"
            />
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li onClick={() => navigate("/")} className="text-sm cursor-pointer hover:text-(--color-primary)">
                Home
              </li>
              <li onClick={() => navigate("/about")} className="text-sm cursor-pointer hover:text-(--color-primary)">
                About
              </li>
              <li onClick={() => navigate("/order-now")} className="text-sm cursor-pointer hover:text-(--color-primary)">
                Order Now
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">For Restaurants</h4>
            <ul className="space-y-2">
              <li onClick={() => navigate("/register/restaurant")} className="text-sm cursor-pointer hover:text-(--color-primary)">
                Partner With Us
              </li>
              <li onClick={() => navigate("/restaurant-dashboard")} className="text-sm cursor-pointer hover:text-(--color-primary)">
                Restaurant Dashboard
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">For Riders</h4>
            <ul className="space-y-2">
              <li onClick={() => navigate("/register/rider")} className="text-sm cursor-pointer hover:text-(--color-primary)">
                Become a Rider
              </li>
              <li onClick={() => navigate("/rider-dashboard")} className="text-sm cursor-pointer hover:text-(--color-primary)">
                Rider Dashboard
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Feedback & Support</h4>
            <ul className="space-y-2">
              <li onClick={() => navigate("/feedback")} className="text-sm cursor-pointer hover:text-(--color-primary)">
                Submit Feedback
              </li>
              <li onClick={() => navigate("/help-center")} className="text-sm cursor-pointer hover:text-(--color-primary)">
                Help Center
              </li>
              <li onClick={() => navigate("/contact")} className="text-sm cursor-pointer hover:text-(--color-primary)">
                Contact Us
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            &copy; {currentYear} Cravings. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-sm hover:text-(--color-primary)">
              Privacy Policy
            </Link>

            <Link to="/terms-of-service" className="text-sm hover:text-(--color-primary)">
              Terms of Service
            </Link>

            <Link to="/site-map" className="text-sm hover:text-(--color-primary)">
              Site Map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;