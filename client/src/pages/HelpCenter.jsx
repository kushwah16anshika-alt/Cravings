import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FaQuestionCircle,
  FaShoppingBag,
  FaCreditCard,
  FaBicycle,
  FaUser,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { IoSparkles, IoHelpBuoyOutline } from "react-icons/io5";
import { RiLoader4Fill } from "react-icons/ri";
import api from "../config/api.config.js";

const HelpCenter = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    issueType: "",
    orderId: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const faqs = [
    {
      question: "How do I track my campus meal in real-time?",
      answer:
        "Open your Customer Dashboard → My Orders to see the real-time order stepper (Placed → Confirmed → Preparing → Out for Delivery → Delivered).",
      icon: <FaShoppingBag className="text-orange-600" />,
    },
    {
      question: "How can I request a cancellation or refund?",
      answer:
        "Raise a support ticket below citing your Order ID, or call our student help desk at +91 98765 43210 for prompt assistance.",
      icon: <FaCreditCard className="text-orange-600" />,
    },
    {
      question: "What if my rider is delayed around campus?",
      answer:
        "Campus deliveries are typically completed within 20-25 minutes. If peak hours cause delays, check live order status or submit a ticket.",
      icon: <FaBicycle className="text-orange-600" />,
    },
    {
      question: "How do I manage my saved dorm addresses?",
      answer:
        "Navigate to Customer Dashboard → Profile & Addresses to add, edit, or set default delivery locations with GPS pinning.",
      icon: <FaUser className="text-orange-600" />,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim()))
      newErrors.email = "Valid email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.issueType) newErrors.issueType = "Please select an issue type";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const message = formData.orderId
        ? `[Order ID: ${formData.orderId.trim()}]\n\n${formData.message.trim()}`
        : formData.message.trim();

      const res = await api.post("/public/contact-us", {
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        subject: `[Support Ticket] ${formData.issueType}`,
        message,
      });

      toast.success(res.data.message || "Support ticket logged! We'll reply shortly.");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        issueType: "",
        orderId: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: FAQs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3.5 py-1 text-xs font-black text-orange-700">
              <IoHelpBuoyOutline />
              <span>Campus Support</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              Help Center & FAQs<span className="text-orange-600">.</span>
            </h1>

            <p className="text-xs sm:text-sm font-medium text-slate-500">
              Quick answers to frequent campus ordering questions, refunds, and live delivery updates.
            </p>

            <div className="space-y-3 pt-2">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-xs transition"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-heading text-sm font-extrabold text-slate-900 hover:text-orange-600 transition"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50">
                          {faq.icon}
                        </span>
                        {faq.question}
                      </span>
                      <span className="text-slate-400">
                        {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-slate-600 text-xs font-medium leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Ticket Form */}
          <div className="lg:col-span-6 rounded-[36px] bg-white border border-slate-200/80 p-8 sm:p-10 shadow-xl shadow-orange-950/5">
            <h2 className="font-heading text-2xl font-black text-slate-900 mb-1">
              Raise a Support Ticket
            </h2>
            <p className="text-xs font-medium text-slate-500 mb-6">
              Our campus support representative will reply directly to your email.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Alex Morgan"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
                />
                {errors.fullName && <p className="text-red-500 text-xs font-bold mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="alex@campus.edu"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
                  />
                  {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
                  />
                  {errors.phone && <p className="text-red-500 text-xs font-bold mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Issue Category
                  </label>
                  <select
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-orange-500"
                  >
                    <option value="">Select Issue</option>
                    <option value="Order Issues">Order Issues</option>
                    <option value="Payment / Refund">Payment / Refund</option>
                    <option value="Delivery Delay">Delivery Delay</option>
                    <option value="Account / Profile">Account / Profile</option>
                    <option value="Other">Other Inquiries</option>
                  </select>
                  {errors.issueType && <p className="text-red-500 text-xs font-bold mt-1">{errors.issueType}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Order ID <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    placeholder="e.g. 64a8f9..."
                    value={formData.orderId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Describe Your Issue
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Explain the problem in detail..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition resize-none"
                />
                {errors.message && <p className="text-red-500 text-xs font-bold mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 disabled:opacity-50 transition"
              >
                {loading ? (
                  <>
                    <RiLoader4Fill className="animate-spin text-lg" />
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <span>Submit Ticket</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
