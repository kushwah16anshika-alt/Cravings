// import React, { useState } from "react";
// import foodBgImg from "../assets/images/fresh-gourmet-meal-beef-taco-salad-plate-generated-by-ai.jpg";

// const Contactus = () => {
//   const [contactUsData, setContactUsData] = useState({
//     fullname: "",
//     email: "",
//     phone: "",
//     contactmsg: "",
//     textArea: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setContactUsData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const payload = {
//       fullname: contactUsData.fullname.toLowerCase(),
//       email: contactUsData.email,
//       phone: contactUsData.phone,
//       contactmsg: contactUsData.contactmsg,
//       message: contactUsData.textArea,
//     };

//     console.log("Contact Form Submitted:", payload);
//   };

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center relative flex items-center"
//       style={{ backgroundImage: `url(${foodBgImg})` }}
//     >
//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-black/50"></div>

//       {/* Content Wrapper */}
//       <div className="relative w-full flex justify-start px-6 md:px-16">
        
//         {/* Form Card */}
//         <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-10">

//           <h2 className="text-3xl font-bold text-center text-orange-500">
//             Contact Us
//           </h2>

//           <p className="text-center mt-2 text-gray-700">
//             Have a question? We'd love to hear from you.
//           </p>

//           <form onSubmit={handleSubmit} className="mt-6">

//             {/* Full Name */}
//             <input
//               type="text"
//               name="fullname"
//               value={contactUsData.fullname}
//               onChange={handleChange}
//               className="my-3 w-full border p-2 rounded focus:outline-orange-400"
//               placeholder="Enter your full name"
//             />

//             {/* Email */}
//             <input
//               type="email"
//               name="email"
//               value={contactUsData.email}
//               onChange={handleChange}
//               className="my-3 w-full border p-2 rounded focus:outline-orange-400"
//               placeholder="Enter your email"
//             />

//             {/* Phone */}
//             <input
//               type="tel"
//               name="phone"
//               value={contactUsData.phone}
//               onChange={handleChange}
//               className="my-3 w-full border p-2 rounded focus:outline-orange-400"
//               placeholder="Enter your phone number"
//             />

//             {/* Subject */}
//             <input
//               type="text"
//               name="contactmsg"
//               value={contactUsData.contactmsg}
//               onChange={handleChange}
//               className="my-3 w-full border p-2 rounded focus:outline-orange-400"
//               placeholder="What is this about?"
//             />

//             {/* Message */}
//             <textarea
//               name="textArea"
//               value={contactUsData.textArea}
//               onChange={handleChange}
//               className="my-3 w-full border p-2 rounded h-24 focus:outline-orange-400"
//               placeholder="Write your message here..."
//             />

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full mt-4 bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition"
//             >
//               Send Message
//             </button>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contactus;

import React, { useState } from "react";
import foodBgImg from "../assets/images/fresh-gourmet-meal-beef-taco-salad-plate-generated-by-ai.jpg";

const ContactUs = () => {
  const [contactUsData, setContactUsData] = useState({
    fullname: "",
    email: "",
    phone: "",
    contactmsg: "",
    textArea: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setContactUsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      fullname: contactUsData.fullname.toLowerCase(),
      email: contactUsData.email,
      phone: contactUsData.phone,
      contactmsg: contactUsData.contactmsg,
      message: contactUsData.textArea,
    };

    console.log("Contact Form Submitted:", payload);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center"
      style={{ backgroundImage: `url(${foodBgImg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative w-full flex justify-start px-6 md:px-16">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-10">

          <h2 className="text-3xl font-bold text-center text-orange-500">
            Contact Us
          </h2>

          <p className="text-center mt-2 text-gray-700">
            Have a question? We'd love to hear from you.
          </p>

          <form onSubmit={handleSubmit} className="mt-6">

            {/* Full Name */}
            <input
              type="text"
              name="fullname"
              value={contactUsData.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="my-3 w-full border p-2 rounded focus:outline-orange-400"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={contactUsData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="my-3 w-full border p-2 rounded focus:outline-orange-400"
            />

            {/* Phone */}
            <input
              type="tel"
              name="phone"
              value={contactUsData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="my-3 w-full border p-2 rounded focus:outline-orange-400"
            />

            {/* Subject */}
            <input
              type="text"
              name="contactmsg"
              value={contactUsData.contactmsg}
              onChange={handleChange}
              placeholder="What is this about?"
              className="my-3 w-full border p-2 rounded focus:outline-orange-400"
            />

            {/* Message */}
            <textarea
              name="textArea"
              value={contactUsData.textArea}
              onChange={handleChange}
              placeholder="Write your message..."
              className="my-3 w-full border p-2 rounded h-24 focus:outline-orange-400"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition"
            >
              Send Message
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
