// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import foodBgImg from "../assets/images/fresh-gourmet-meal-beef-taco-salad-plate-generated-by-ai.jpg";

// const ContactUs = () => {
//   const navigate = useNavigate();

//   const [contactData, setContactData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     subject: "",
//     message: "",
//   });

//   const [validateError, setValidateError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setContactData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (
//       !contactData.fullName ||
//       !contactData.email ||
//       !contactData.phone ||
//       !contactData.subject ||
//       !contactData.message
//     ) {
//       setValidateError("All fields are required.");
//       return;
//     }

//     setValidateError("");

//     const payload = {
//       fullName: contactData.fullName,
//       email: contactData.email.toLowerCase(),
//       phone: contactData.phone,
//       subject: contactData.subject,
//       message: contactData.message,
//     };

//     console.log("Contact Form Submitted:", payload);

//     setSuccessMessage(
//       "Thank you for contacting us! We'll get back to you soon."
//     );

//     setContactData({
//       fullName: "",
//       email: "",
//       phone: "",
//       subject: "",
//       message: "",
//     });

//     setTimeout(() => {
//       setSuccessMessage("");
//     }, 3000);
//   };

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center relative flex items-center"
//       style={{ backgroundImage: `url(${foodBgImg})` }}
//     >
//       <div className="absolute inset-0 bg-black/50"></div>

//       <div className="relative w-full flex justify-start px-6 md:px-16">
//         <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-10">
//           <h2 className="text-3xl font-bold text-center text-orange-500">
//             Contact Us
//           </h2>

//           <p className="text-center mt-2 text-gray-700">
//             Have a question? We'd love to hear from you.
//           </p>

//           <form onSubmit={handleSubmit} className="mt-6">
//             <input
//               type="text"
//               name="fullName"
//               value={contactData.fullName}
//               onChange={handleChange}
//               placeholder="Enter your full name"
//               className="my-3 w-full border p-2 rounded focus:outline-orange-400"
//             />

//             <input
//               type="email"
//               name="email"
//               value={contactData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="my-3 w-full border p-2 rounded focus:outline-orange-400"
//             />

//             <input
//               type="tel"
//               name="phone"
//               value={contactData.phone}
//               onChange={handleChange}
//               placeholder="Enter your phone number"
//               className="my-3 w-full border p-2 rounded focus:outline-orange-400"
//             />

//             <input
//               type="text"
//               name="subject"
//               value={contactData.subject}
//               onChange={handleChange}
//               placeholder="Subject"
//               className="my-3 w-full border p-2 rounded focus:outline-orange-400"
//             />

//             <textarea
//               name="message"
//               value={contactData.message}
//               onChange={handleChange}
//               placeholder="Write your message..."
//               className="my-3 w-full border p-2 rounded h-24 focus:outline-orange-400"
//             />

//             {validateError && (
//               <p className="text-red-500 text-sm">{validateError}</p>
//             )}

//             {successMessage && (
//               <p className="text-green-500 text-sm">{successMessage}</p>
//             )}

//             <button
//               type="submit"
//               className="w-full mt-4 bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition"
//             >
//               Send Message
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-sm">
//               Want to order delicious food?{" "}
//               <button
//                 onClick={() => navigate("/login")}
//                 className="text-orange-500 hover:underline font-semibold"
//               >
//                 Login
//               </button>
//               {" | "}
//               <button
//                 onClick={() => navigate("/register")}
//                 className="text-orange-500 hover:underline font-semibold"
//               >
//                 Register
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactUs;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

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
      "Thank you for contacting us! We'll get back to you soon.",
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
      className="
        min-h-screen
        relative
        flex
        items-center
        justify-center
        bg-cover
        bg-center
        px-6
        py-16
      "
      style={{
        backgroundImage: `url(${foodBgImg})`,
      }}
    >
      {/* Background Overlay */}

      <div
        className="
          absolute
          inset-0
          bg-slate-950/80
        "
      />

      <div
        className="
          relative
          z-10
          grid
          w-full
          max-w-6xl
          gap-10
          lg:grid-cols-2
          items-center
        "
      >
        {/* Left Content */}

        <div className="text-white space-y-6">
          <h1
            className="
              text-5xl
              md:text-6xl
              font-black
              leading-tight
            "
          >
            Contact
            <span
              className="
                block
                text-orange-400
              "
            >
              Cravings
            </span>
          </h1>

          <p
            className="
              max-w-lg
              text-lg
              text-slate-300
            "
          >
            Have questions about orders, restaurants, delivery or partnerships?
            We would love to hear from you.
          </p>

          <div className="space-y-4">
            <div
              className="
                flex
                items-center
                gap-4
                rounded-xl
                border
                border-slate-700
                bg-slate-900/60
                p-4
              "
            >
              <FaPhoneAlt className="text-orange-400 text-xl" />

              <div>
                <h3 className="font-bold">Phone</h3>

                <p className="text-slate-400">+91 9876543210</p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-4
                rounded-xl
                border
                border-slate-700
                bg-slate-900/60
                p-4
              "
            >
              <FaEnvelope className="text-orange-400 text-xl" />

              <div>
                <h3 className="font-bold">Email</h3>

                <p className="text-slate-400">support@cravings.com</p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-4
                rounded-xl
                border
                border-slate-700
                bg-slate-900/60
                p-4
              "
            >
              <FaMapMarkerAlt className="text-orange-400 text-xl" />

              <div>
                <h3 className="font-bold">Address</h3>

                <p className="text-slate-400">India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}

        <div
          className="
            rounded-3xl
            border
            border-slate-700
            bg-white/10
            backdrop-blur-xl
            p-6
            md:p-10
            shadow-2xl
          "
        >
          <h2
            className="
              text-center
              text-3xl
              font-bold
              text-white
            "
          >
            Contact Us
          </h2>

          <p
            className="
              mt-2
              text-center
              text-slate-300
            "
          >
            Have a question? We'd love to hear from you.
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
            <input
              type="text"
              name="fullName"
              value={contactData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="
                my-3
                w-full
                rounded-xl
                border
                border-slate-600
                bg-slate-900/70
                px-4
                py-3
                text-white
                outline-none
                focus:border-orange-400
              "
            />

            <input
              type="email"
              name="email"
              value={contactData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="
                my-3
                w-full
                rounded-xl
                border
                border-slate-600
                bg-slate-900/70
                px-4
                py-3
                text-white
                outline-none
                focus:border-orange-400
              "
            />

            <input
              type="tel"
              name="phone"
              value={contactData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="
                my-3
                w-full
                rounded-xl
                border
                border-slate-600
                bg-slate-900/70
                px-4
                py-3
                text-white
                outline-none
                focus:border-orange-400
              "
            />

            <input
              type="text"
              name="subject"
              value={contactData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="
                my-3
                w-full
                rounded-xl
                border
                border-slate-600
                bg-slate-900/70
                px-4
                py-3
                text-white
                outline-none
                focus:border-orange-400
              "
            />

            <textarea
              name="message"
              value={contactData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              className="
                my-3
                h-28
                w-full
                resize-none
                rounded-xl
                border
                border-slate-600
                bg-slate-900/70
                px-4
                py-3
                text-white
                outline-none
                focus:border-orange-400
              "
            />

            {validateError && (
              <p className="text-red-400 text-sm">{validateError}</p>
            )}

            {successMessage && (
              <p className="text-green-400 text-sm">{successMessage}</p>
            )}

            <button
              type="submit"
              className="
                mt-4
                w-full
                rounded-xl
                bg-orange-500
                py-3
                font-bold
                text-white
                transition
                hover:bg-orange-600
              "
            >
              Send Message
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-300">
              Want to order delicious food?
              <button
                onClick={() => navigate("/login")}
                className="
                  mx-2
                  font-semibold
                  text-orange-400
                  hover:underline
                "
              >
                Login
              </button>
              |
              <button
                onClick={() => navigate("/register")}
                className="
                  mx-2
                  font-semibold
                  text-orange-400
                  hover:underline
                "
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
