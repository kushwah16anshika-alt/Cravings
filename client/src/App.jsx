// import React from "react";
// import { Toaster } from "react-hot-toast";
// import { Routes, Route } from "react-router-dom";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// import Home from "./pages/Home";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import Contact from "./pages/ContactUs";
// import CustomerDashboard from "./pages/dashboard/UserDashboard";
// import RestaurantDashboard from "./pages/dashboard/RestaurantDashboard";
// import RiderDashboard from "./pages/dashboard/RiderDashboard";
// import AdminDashboard from "./pages/dashboard/AdminDashboard";
// import Test from "./pages/Test";
// import OrderNow from "./pages/OrderNow";
// import RestaurantDetailsPage from "./pages/RestaurantDetailsPage";

// const App = () => {
//   return (
//     <>
//       <Toaster />
//       <Navbar />

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/contact" element={<Contact />} />

//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/register/:userType" element={<Register />} />

//         <Route path="/customer-dashboard" element={<CustomerDashboard />} />
//         <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
//         <Route path="/rider-dashboard" element={<RiderDashboard />} />
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />

//         <Route path="/test" element={<Test />} />
//         <Route path="/order-now" element={<OrderNow />} />
//         <Route
//           path="/restaurant-details/:restaurantId"
//           element={<RestaurantDetailsPage />}
//         />
//       </Routes>

//       <Footer />
//     </>
//   );
// };

// export default App;



import React from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Contact from "./pages/ContactUs";
import CustomerDashboard from "./pages/dashboard/UserDashboard";
import RestaurantDashboard from "./pages/dashboard/RestaurantDashboard";
import RiderDashboard from "./pages/dashboard/RiderDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Test from "./pages/Test";
import OrderNow from "./pages/OrderNow";
import RestaurantDetailsPage from "./pages/RestaurantDetailsPage";
import Cart from "./components/Cart";

const App = () => {
  return (
    <>
      <Toaster />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/:userType" element={<Register />} />

        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route
          path="/restaurant-dashboard"
          element={<RestaurantDashboard />}
        />
        <Route path="/rider-dashboard" element={<RiderDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        <Route path="/test" element={<Test />} />
        <Route path="/order-now" element={<OrderNow />} />

        <Route
          path="/restaurant-details/:restaurantId"
          element={<RestaurantDetailsPage />}
        />

        <Route path="/cart" element={<Cart />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;