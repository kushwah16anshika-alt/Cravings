import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { RiLoader4Fill } from "react-icons/ri";
import toast from "react-hot-toast";
import api from "../config/api.config.js";
import foodBgImg from "../assets/images/fresh-gourmet-meal-beef-taco-salad-plate-generated-by-ai.jpg";

const ContactUs = () => {
  const navigate = useNavigate();

  const [contactData, setContactData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !contactData.fullName ||
      !contactData.email ||
      !contactData.phone ||
      !contactData.subject ||
      !contactData.message
    ) {
      toast.error("All fields are required.");
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        fullName: contactData.fullName.trim(),
        email: contactData.email.toLowerCase().trim(),
        phone: contactData.phone.trim(),
        subject: contactData.subject.trim(),
        message: contactData.message.trim(),
      };

      const response = await api.post("/public/contact-us", payload);

      toast.success(
        response.data.message || "Thank you for contacting us! We will reach out soon."
      );

      setContactData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit message. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center bg-cover bg-center px-6 py-16"
      style={{
        backgroundImage: `url(${foodBgImg})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/80" />

      <div className="relative z-10 grid w-full max-w-6xl gap-10 lg:grid-cols-2 items-center">
        {/* Left Content */}
        <div className="text-white space-y-6">
          <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-wider uppercase bg-(--color-primary)/20 text-(--color-primary) border border-(--color-primary)/30 rounded-full">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-white">
            We'd love to hear from you.
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-lg leading-relaxed">
            Have questions about an order, restaurant partnership, or delivery? Reach out to our team anytime.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-(--color-primary)/20 flex items-center justify-center text-(--color-primary)">
                <FaPhoneAlt className="text-xl" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Call Us Directly</p>
                <p className="text-white font-semibold">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-(--color-primary)/20 flex items-center justify-center text-(--color-primary)">
                <FaEnvelope className="text-xl" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Email Support</p>
                <p className="text-white font-semibold">support@cravings.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-(--color-primary)/20 flex items-center justify-center text-(--color-primary)">
                <FaMapMarkerAlt className="text-xl" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Headquarters</p>
                <p className="text-white font-semibold">Tech City, Bangalore, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Send us a Message
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Fill out the form below and we will respond within 24 hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={contactData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={contactData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={contactData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Message
              </label>
              <textarea
                name="message"
                value={contactData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Write your thoughts or issues here..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-(--color-primary) hover:bg-(--color-primary-focus) active:scale-[0.98] transition flex items-center justify-center space-x-2 shadow-lg shadow-(--color-primary)/30 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RiLoader4Fill className="animate-spin text-xl" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <span>Send Message</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
