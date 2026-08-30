import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoCircle from "../assets/images/circleLogo-DpCri5UD.png";
import {
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoLinkedin,
  IoLogoGithub,
  IoHeart,
  IoMailOutline,
} from "react-icons/io5";
import toast from "react-hot-toast";

const Footer = () => {
  const location = useLocation().pathname;
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  if (location.toLowerCase().includes("dashboard")) {
    return null;
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    toast.success("Subscribed to Cravings Campus Bites newsletter!");
    setNewsletterEmail("");
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Top Newsletter Strip */}
        <div className="rounded-3xl bg-gradient-to-r from-orange-950/60 to-amber-950/40 border border-orange-500/20 p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-heading text-xl sm:text-2xl font-black text-white">
              Stay in the Loop on Campus Discounts 🍕
            </h3>
            <p className="text-xs text-slate-300">
              Get flash coupon codes, secret canteen menus, and student rewards in your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <IoMailOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 text-base" />
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your student email"
                className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-orange-500"
              />
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-orange-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-orange-600/30 hover:bg-orange-500 active:scale-95 transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoCircle}
                alt="Cravings Logo"
                className="h-12 w-12 object-contain"
              />
              <span className="font-heading text-2xl font-black tracking-tight text-white">
                Cravings<span className="text-orange-500">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The premier smart food ordering and cafeteria management platform built for modern campuses and hungry foodies.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-orange-600 hover:text-white transition"
              >
                <IoLogoInstagram size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-orange-600 hover:text-white transition"
              >
                <IoLogoTwitter size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-orange-600 hover:text-white transition"
              >
                <IoLogoLinkedin size={18} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-orange-600 hover:text-white transition"
              >
                <IoLogoGithub size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              <li>
                <Link to="/" className="hover:text-orange-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/order-now" className="hover:text-orange-400 transition">
                  Campus Eateries
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-orange-400 transition">
                  Active Cart
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner Links */}
          <div>
            <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-200 mb-4">
              Partnerships
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              <li>
                <Link to="/register/restaurant" className="hover:text-orange-400 transition">
                  Register Restaurant
                </Link>
              </li>
              <li>
                <Link to="/restaurant-dashboard" className="hover:text-orange-400 transition">
                  Kitchen Portal
                </Link>
              </li>
              <li>
                <Link to="/register/rider" className="hover:text-orange-400 transition">
                  Become a Campus Rider
                </Link>
              </li>
              <li>
                <Link to="/rider-dashboard" className="hover:text-orange-400 transition">
                  Rider Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="font-heading text-xs font-black uppercase tracking-widest text-slate-200 mb-4">
              Assistance
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              <li>
                <Link to="/help-center" className="hover:text-orange-400 transition">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-orange-400 transition">
                  Give Feedback
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Campus Guidelines
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Dietary Standards
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs font-medium text-slate-500 gap-4">
          <p className="flex items-center gap-1">
            <span>&copy; {currentYear} Cravings. Handcrafted with</span>
            <IoHeart className="text-red-500" />
            <span>for hungry foodies.</span>
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