
// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ContactUs from "./pages/ContactUs";
// import UserDashboard from "./pages/dashboard/userDashboard";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// import { Toaster } from "react-hot-toast";
// import { AuthProvider } from "./context/AuthContext";

// const App = () => {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Toaster />

//         <Navbar />

//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/contact-us" element={<ContactUs />} />
//           <Route path="/UserDashboard" element={<UserDashboard />} />
//         </Routes>

//         <Footer />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ContactUs from "./pages/ContactUs";

import UserDashboard from "./pages/dashboard/UserDashboard";
import RestaurantDashboard from "./pages/dashboard/RestaurantDashboard";
import RiderDashboard from "./pages/dashboard/RiderDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster />

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
          <Route path="/register/:userType" element={<Register />} />

          <Route path="/contact-us" element={<ContactUs />} />

          <Route path="/UserDashboard" element={<UserDashboard />} />
          <Route
            path="/restaurant-dashboard"
            element={<RestaurantDashboard />}
          />
          <Route path="/rider-dashboard" element={<RiderDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;