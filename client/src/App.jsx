import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import HelpCenter from "./pages/HelpCenter";

import CustomerDashboard from "./pages/dashboard/CustomerDashboard";
import RestaurantDashboard from "./pages/dashboard/RestaurantDashboard";
import RiderDashboard from "./pages/dashboard/RiderDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

import { AuthProvider } from "./context/AuthContext";

const App = () => {
  const location = useLocation();

  const hideFooterRoutes = [
    "/customer-dashboard",
    "/restaurant-dashboard",
    "/rider-dashboard",
    "/admin-dashboard",
  ];

  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster />

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/help-center" element={<HelpCenter />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
          <Route path="/register/:userType" element={<Register />} />

          <Route
            path="/customer-dashboard"
            element={<CustomerDashboard />}
          />
          <Route
            path="/restaurant-dashboard"
            element={<RestaurantDashboard />}
          />
          <Route path="/rider-dashboard" element={<RiderDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>

        {shouldShowFooter && <Footer />}
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;