import React from "react";
import { MdDashboard, MdFavoriteBorder } from "react-icons/md";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const RiderSidebar = ({ activeTab, setActiveTab }) => {
  const mainTabs = [
    { name: "Overview", value: "overview", icon: <MdDashboard /> },
    { name: "Orders", value: "orders", icon: <FaShoppingCart /> },
    { name: "Profile", value: "profile", icon: <FaUserCircle /> },
  ];

  const settingsTab = {
    name: "Settings",
    value: "settings",
    icon: <IoMdSettings />,
  };

  const renderTab = (tab) => (
    <li
      key={tab.value}
      onClick={() => setActiveTab(tab.value)}
      className={`cursor-pointer p-3 rounded-lg flex items-center gap-3 text-(--color-neutral) ${
        activeTab === tab.value
          ? "bg-(--color-primary) text-(--color-primary-content) font-semibold"
          : "hover:bg-(--color-secondary) hover:text-(--color-secondary-content)"
      }`}
    >
      <span className="text-xl">{tab.icon}</span>
      <span>{tab.name}</span>
    </li>
  );

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold text-center mb-6 text-(--color-neutral)">
        Rider Dashboard
      </h2>

      <ul className="space-y-3 flex-1">
        {mainTabs.map((tab) => renderTab(tab))}
      </ul>

      <ul className="space-y-3 border-t border-(--color-secondary) pt-3">
        {renderTab(settingsTab)}
      </ul>
    </div>
  );
};

export default RiderSidebar;