// import React, { useState } from "react";
// const Login = () => {
//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });

//   const [validateError, setValidateError] = useState();

//   const handleChange = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;

//     setLoginData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log("Login data submitted:", loginData);

//     const payload = {
//       email: loginData.email.toLowerCase(),
//       password: loginData.password,
//     };
//   };

//   return (
//     <>
//       <div className="h-fit bg-cover bg-center bg-[url('/foodTable.webp')]">
//         <div className="h-[92vh] grid grid-cols-1 md:grid-cols-2 p-10 items-start">
//           <div className="w-full max-w-md bg-(--background) rounded-3xl shadow p-6 md:p-10 mt-5 md:mt-0 self-start">
//             <div className="var(text-2xl) font-bold mb-1 text-(--accent) flex justify-center items-center text-3xl">
//               Welcome Back!
//             </div>
//             <span className="block text-center">
//               Login to your craving account
//             </span>

//             <form onSubmit={handleSubmit} className="mt-6">
//               <div className="flex flex-col gap-2">
//                 <label htmlFor="email">Email</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={loginData.email}
//                   onChange={handleChange}
//                   className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-(--accent)"
//                   placeholder="Enter your email"
//                 />
//               </div>

//               <div className="flex flex-col gap-2 mt-4">
//                 <label htmlFor="password">Password</label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={loginData.password}
//                   onChange={handleChange}
//                   className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-(--accent)"
//                   placeholder="Enter your password"
//                 />
//               </div>

//               <div className="mt-4 flex justify-between items-center text-sm">
//                 <div className="flex items-center">
//                   <input type="checkbox" id="remember" />
//                   <label htmlFor="remember" className="ms-1">
//                     Remember Me
//                   </label>
//                 </div>

//                 <span className="cursor-pointer hover:underline hover:text-(--accent)">
//                   Forgot Password?
//                 </span>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full mt-6 bg-(--accent) text-(--primary-text) py-3 px-4 rounded hover:bg-(--accent)"
//               >
//                 Login
//               </button>

//               <div className="mt-6">
//                 <div className="flex items-center">
//                   <div className="flex-1 border-t border-gray-400"></div>

//                   <span className="px-4 text-sm text-gray-600">
//                     Don't have an account?
//                   </span>

//                   <div className="flex-1 border-t border-gray-400"></div>
//                 </div>

//                 <a href="./register">
//                   <p className="text-center text-(--accent) text-lg font-semibold mt-3 cursor-pointer hover:underline">
//                     Create an account
//                   </p>
//                 </a>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;








import React, { useState } from "react";
import foodBg from "../assets/images/fresh-gourmet-meal-beef-taco-salad-plate-generated-by-ai.jpg";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(loginData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-start bg-cover bg-center relative pl-16"
      style={{ backgroundImage: `url(${foodBg})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Login Box */}
      <div className="relative w-[90%] max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-orange-500 text-center">
          Welcome Back!
        </h2>

        <p className="text-center text-gray-600 mt-1">
          Login to your craving account
        </p>

        <form onSubmit={handleSubmit} className="mt-6">

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 mt-4">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center mt-3 text-sm">
            <label className="flex items-center gap-1">
              <input type="checkbox" />
              Remember me
            </label>

            <span className="text-orange-500 cursor-pointer hover:underline">
              Forgot Password?
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded mt-5 hover:bg-orange-600 transition"
          >
            Login
          </button>

          {/* Register */}
          <p className="text-center mt-5 text-sm">
            Don't have an account?{" "}
            <span className="text-orange-500 font-semibold cursor-pointer hover:underline">
              Create account
            </span>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;