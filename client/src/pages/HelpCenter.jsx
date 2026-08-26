import { useState } from "react";
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
import { RiLoader4Fill } from "react-icons/ri";
import api from "../config/api.config.js";
import helpBgImg from "../assets/images/HelpPage.jpg";

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
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "How do I track my order in real-time?",
      answer:
        "Head over to your Customer Dashboard → Orders to view your live order status and delivery updates.",
      icon: <FaShoppingBag />,
    },
    {
      question: "How can I request a cancellation or refund?",
      answer:
        "Submit a support ticket below mentioning your Order ID, or contact our support helpline for instant resolution.",
      icon: <FaCreditCard />,
    },
    {
      question: "What should I do if my rider is delayed?",
      answer:
        "You can check your order details for live updates or raise a ticket directly through this support page.",
      icon: <FaBicycle />,
    },
    {
      question: "How do I manage my delivery addresses?",
      answer:
        "Open your Customer Dashboard → Settings → Address Book to add, edit, or delete saved addresses.",
      icon: <FaUser />,
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

      toast.success(res.data.message || "Support ticket submitted successfully");

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

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-3 bg-slate-900/80 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-(--color-primary) transition text-sm ${
      errors[field] ? "border-red-500" : "border-slate-700"
    }`;

  return (
    <div
      className="min-h-screen relative flex items-center justify-center bg-cover bg-center px-6 py-16"
      style={{
        backgroundImage: `url(${helpBgImg})`,
      }}
    >
      <div className="absolute inset-0 bg-slate-950/85" />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-10 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-6 md:p-10 shadow-2xl">
        {/* Left Side: FAQs & Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-(--color-primary)/20 text-(--color-primary) border border-(--color-primary)/30 rounded-full mb-3">
              Customer Assistance
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
              <FaQuestionCircle className="text-(--color-primary)" />
              Help Center
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Browse frequently asked questions or raise a ticket directly to our 24/7 support team.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">
              Frequently Asked Questions
            </h2>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-white font-medium text-sm hover:text-(--color-primary) transition"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-(--color-primary) text-base">{faq.icon}</span>
                    {faq.question}
                  </span>
                  <span className="text-slate-400">
                    {activeFaq === idx ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-slate-300 text-xs leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Ticket Submission Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white mb-1">
            Raise a Support Ticket
          </h2>
          <p className="text-slate-400 text-xs mb-6">
            We will get back to your registered email within a few hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                className={inputClass("fullName")}
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass("email")}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={inputClass("phone")}
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Issue Type
                </label>
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  className={inputClass("issueType")}
                >
                  <option value="" className="bg-slate-900">
                    Select Issue Type
                  </option>
                  <option value="Order Issues" className="bg-slate-900">
                    Order Issues
                  </option>
                  <option value="Payment / Refund" className="bg-slate-900">
                    Payment / Refund
                  </option>
                  <option value="Delivery Delay" className="bg-slate-900">
                    Delivery Delay
                  </option>
                  <option value="Account / Profile" className="bg-slate-900">
                    Account / Profile
                  </option>
                  <option value="Other" className="bg-slate-900">
                    Other Inquiries
                  </option>
                </select>
                {errors.issueType && (
                  <p className="text-red-400 text-xs mt-1">{errors.issueType}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Order ID <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="orderId"
                  placeholder="e.g. 64a8f9..."
                  value={formData.orderId}
                  onChange={handleInputChange}
                  className={inputClass("orderId")}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Describe Your Issue
              </label>
              <textarea
                name="message"
                rows={3}
                placeholder="Explain the problem in detail..."
                value={formData.message}
                onChange={handleInputChange}
                className={`${inputClass("message")} resize-none`}
              />
              {errors.message && (
                <p className="text-red-400 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-(--color-primary) hover:bg-(--color-primary-focus) active:scale-[0.98] transition flex items-center justify-center space-x-2 shadow-lg shadow-(--color-primary)/30 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RiLoader4Fill className="animate-spin text-xl" />
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
  );
};

export default HelpCenter;
