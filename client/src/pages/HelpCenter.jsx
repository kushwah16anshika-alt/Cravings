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
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "How do I track my order?",
      answer:
        "Go to your dashboard → Orders and click on your active order to track delivery.",
      icon: <FaShoppingBag />,
    },
    {
      question: "How can I get a refund?",
      answer:
        "Submit a support ticket with your Order ID and our team will process your request.",
      icon: <FaCreditCard />,
    },
    {
      question: "My rider is late?",
      answer:
        "You can contact the rider from your order page or raise a support request.",
      icon: <FaBicycle />,
    },
    {
      question: "How to update profile?",
      answer: "Go to dashboard settings and update your account information.",
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

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    if (!formData.issueType) newErrors.issueType = "Select issue type";

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
        ? `Order ID: ${formData.orderId}\n\n${formData.message}`
        : formData.message;

      const res = await api.post("/public/contact-us", {
        fullName: formData.fullName,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        subject: formData.issueType,
        message,
      });

      toast.success(res.data.message || "Ticket submitted successfully");

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
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `
  w-full
  rounded-xl
  border
  px-4
  py-3
  bg-slate-900/70
  text-white
  outline-none
  focus:border-orange-400
  ${errors[field] ? "border-red-500" : "border-slate-600"}
  `;

  return (
    <div
      className="
min-h-screen
relative
flex
items-center
justify-center
bg-[url('/HelpPage.jpg')]
bg-cover
bg-center
px-6
py-16
"
    >
      <div
        className="
absolute
inset-0
bg-black/70
"
      />

      <div
        className="
relative
z-10
w-full
max-w-6xl
grid
lg:grid-cols-2
gap-10
rounded-3xl
bg-white/10
backdrop-blur-xl
border
border-white/20
p-6
md:p-10
"
      >
        <div>
          <h1
            className="
text-4xl
font-black
text-white
flex
items-center
gap-3
"
          >
            <FaQuestionCircle className="text-orange-400" />
            Help Center
          </h1>

          <p
            className="
mt-3
text-slate-300
"
          >
            Browse FAQs or create a support ticket.
          </p>

          <div className="mt-8 space-y-4">
            {faqs.map((faq, index) => {
              const open = activeFaq === index;

              return (
                <div
                  key={index}
                  className="
rounded-xl
border
border-white/20
bg-white/5
overflow-hidden
"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="
w-full
flex
justify-between
items-center
p-4
text-white
"
                  >
                    <div
                      className="
flex
items-center
gap-3
"
                    >
                      <span className="text-orange-400">{faq.icon}</span>

                      {faq.question}
                    </div>

                    {open ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  {open && (
                    <div
                      className="
px-4
pb-4
text-sm
text-slate-300
"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2
            className="
text-3xl
font-bold
text-white
mb-6
"
          >
            Submit Ticket
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className={inputClass("fullName")}
            />

            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className={inputClass("email")}
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className={inputClass("phone")}
            />

            <select
              name="issueType"
              value={formData.issueType}
              onChange={handleInputChange}
              className={inputClass("issueType")}
            >
              <option value="">Select Issue Type</option>

              <option>Order Issues</option>

              <option>Payment Problem</option>

              <option>Delivery Problem</option>

              <option>Account Issue</option>

              <option>Other</option>
            </select>

            <input
              name="orderId"
              value={formData.orderId}
              onChange={handleInputChange}
              placeholder="Order ID (Optional)"
              className={inputClass("orderId")}
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Describe your problem"
              rows="5"
              className={inputClass("message")}
            />

            <button
              disabled={loading}
              className="
w-full
bg-orange-500
hover:bg-orange-600
text-white
font-bold
py-3
rounded-xl
transition
"
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
