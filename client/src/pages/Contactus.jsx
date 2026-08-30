import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { RiLoader4Fill } from "react-icons/ri";
import { IoSparkles, IoPaperPlaneOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import api from "../config/api.config.js";
import foodBgImg from "../assets/images/fresh-gourmet-meal-beef-taco-salad-plate-generated-by-ai.jpg";

const ContactUs = () => {
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
    <div className="min-h-screen bg-[#fcfaf7] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3.5 py-1 text-xs font-black text-orange-700">
              <IoSparkles />
              <span>We're Here For You</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
              Get in Touch with Cravings<span className="text-orange-600">.</span>
            </h1>

            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              Have questions regarding an ongoing order, canteen vendor onboarding, or campus rider support? Reach out to our 24/7 student support desk.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-4 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 flex-shrink-0">
                  <FaPhoneAlt size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Call Us</p>
                  <p className="font-heading text-sm font-black text-slate-900">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 flex-shrink-0">
                  <FaEnvelope size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Support</p>
                  <p className="font-heading text-sm font-black text-slate-900">support@cravings.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 flex-shrink-0">
                  <FaMapMarkerAlt size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Campus Hub</p>
                  <p className="font-heading text-sm font-black text-slate-900">Student Innovation Centre, Campus</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Contact Form Card */}
          <div className="lg:col-span-7 rounded-[32px] bg-white border border-slate-200/80 p-8 sm:p-10 shadow-xl shadow-orange-950/5">
            <h2 className="font-heading text-2xl font-black text-slate-900 mb-1">
              Send us a Message
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mb-6">
              Our campus coordination team typically responds within a few hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={contactData.fullName}
                  onChange={handleChange}
                  placeholder="Alex Morgan"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactData.email}
                    onChange={handleChange}
                    placeholder="alex@campus.edu"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={contactData.subject}
                  onChange={handleChange}
                  placeholder="Order Inquiry / Partnership request"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={contactData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Explain how we can help you..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 disabled:opacity-50 transition"
              >
                {isLoading ? (
                  <>
                    <RiLoader4Fill className="animate-spin text-lg" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <IoPaperPlaneOutline size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
