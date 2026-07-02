import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const [validateError, setValidateError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setContactData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !contactData.fullName ||
      !contactData.email ||
      !contactData.phone ||
      !contactData.subject ||
      !contactData.message
    ) {
      setValidateError("All fields are required.");
      return;
    }

    setValidateError("");

    const payload = {
      fullName: contactData.fullName,
      email: contactData.email.toLowerCase(),
      phone: contactData.phone,
      subject: contactData.subject,
      message: contactData.message,
    };

    console.log("Contact Form Submitted:", payload);

    setSuccessMessage(
      "Thank you for contacting us! We'll get back to you soon."
    );

    setContactData({
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center"
      style={{ backgroundImage: `url(${foodBgImg})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative w-full flex justify-start px-6 md:px-16">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-10">
          <h2 className="text-3xl font-bold text-center text-orange-500">
            Contact Us
          </h2>

          <p className="text-center mt-2 text-gray-700">
            Have a question? We'd love to hear from you.
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
            <input
              type="text"
              name="fullName"
              value={contactData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="my-3 w-full border p-2 rounded focus:outline-orange-400"
            />

            <input
              type="email"
              name="email"
              value={contactData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="my-3 w-full border p-2 rounded focus:outline-orange-400"
            />

            <input
              type="tel"
              name="phone"
              value={contactData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="my-3 w-full border p-2 rounded focus:outline-orange-400"
            />

            <input
              type="text"
              name="subject"
              value={contactData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="my-3 w-full border p-2 rounded focus:outline-orange-400"
            />

            <textarea
              name="message"
              value={contactData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              className="my-3 w-full border p-2 rounded h-24 focus:outline-orange-400"
            />

            {validateError && (
              <p className="text-red-500 text-sm">{validateError}</p>
            )}

            {successMessage && (
              <p className="text-green-500 text-sm">{successMessage}</p>
            )}

            <button
              type="submit"
              className="w-full mt-4 bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition"
            >
              Send Message
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm">
              Want to order delicious food?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-orange-500 hover:underline font-semibold"
              >
                Login
              </button>
              {" | "}
              <button
                onClick={() => navigate("/register")}
                className="text-orange-500 hover:underline font-semibold"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
