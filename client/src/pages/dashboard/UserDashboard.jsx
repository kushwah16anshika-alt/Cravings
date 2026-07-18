import React from "react";
import Sidebar from "../../components/userDashboard/Sidebar";
import Overview from "../../components/userDashboard/Overview";
import Order from "../../components/userDashboard/Order";
import Setting from "../../components/userDashboard/Setting";
import Wishlist from "../../components/userDashboard/Wishlist";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();

  const active = useLocation().state?.activeTab;
  const [activeTab, setActiveTab] = React.useState(active || "overview");

  if (!isLogin || role !== "user") {
    return (
      <div className="h-[92vh] bg-[url('/foodTable.webp')] bg-cover bg-center">
        <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-(--color-neutral-content)">
            Access Denied. Please log in as a user to view this page.
          </h1>

          <button
            className="mt-4 px-4 py-2 bg-(--color-primary) text-white rounded-md"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[91vh] flex gap-2 p-2">
      <div className="w-3/17 bg-(--color-base-200) p-4 rounded-lg shadow-md h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="w-14/17 bg-(--color-base-100) p-4 rounded-lg shadow-md h-full">
        {activeTab === "overview" && <Overview />}
        {activeTab === "orders" && <Order />}
        {activeTab === "wishlist" && <Wishlist />}
        {activeTab === "settings" && <Setting />}
      </div>
    </div>
  );
};

export default UserDashboard;