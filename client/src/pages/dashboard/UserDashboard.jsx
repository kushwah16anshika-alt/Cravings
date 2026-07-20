import React from "react";
import Sidebar from "../../components/userDashboard/Sidebar";
import Overview from "../../components/userDashboard/Overview";
import Order from "../../components/userDashboard/Order";
import Setting from "../../components/userDashboard/Setting";
import Wishlist from "../../components/userDashboard/Wishlist";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
  const { isLogin, user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = React.useState(
    location.state?.activeTab || "overview"
  );
  console.log("isLogin =", isLogin);
console.log("user =", user);

if (user) {
  console.log("userType =", user.userType);
}

  // Access Protection
  if (!isLogin || user?.userType !== "user") {
    return (
      <div className="h-[92vh] bg-[url('/foodTable.webp')] bg-cover bg-center">
        <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-(--color-neutral-content)">
            Access Denied. Please log in as a user to view this page.
          </h1>

          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-5 py-2 bg-(--color-primary) text-white rounded-md hover:opacity-90 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[91vh] flex gap-3 p-3">
      {/* Sidebar */}
      <div className="w-3/17 bg-(--color-base-200) p-4 rounded-lg shadow-md h-full">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Dashboard Content */}
      <div className="w-14/17 bg-(--color-base-100) p-4 rounded-lg shadow-md h-full overflow-y-auto">
        {activeTab === "overview" && <Overview />}
        {activeTab === "orders" && <Order />}
        {activeTab === "wishlist" && <Wishlist />}
        {activeTab === "settings" && <Setting />}
      </div>
    </div>
  );
};

export default UserDashboard;