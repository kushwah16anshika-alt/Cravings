import React from "react";
import { MdDashboard, MdRestaurantMenu } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const RestaurantSidebar = ({ activeTab, setActiveTab }) => {
  const mainTabs = [
    {
      name: "Overview",
      value: "overview",
      icon: <MdDashboard size={24} />,
    },
    {
      name: "Menu",
      value: "menu",
      icon: <MdRestaurantMenu size={24} />,
    },
    {
      name: "Orders",
      value: "orders",
      icon: <FaShoppingCart size={24} />,
    },
  ];

  const settingsTab = {
    name: "Settings",
    value: "settings",
    icon: <IoMdSettings size={24} />,
  };

  const renderTab = (tab) => (
    <li
      key={tab.value}
      onClick={() => setActiveTab(tab.value)}
      className={`cursor-pointer p-3 rounded-lg flex items-center gap-3 transition ${
        activeTab === tab.value
          ? "bg-(--color-primary) text-(--color-primary-content) font-semibold"
          : "text-(--color-neutral) hover:bg-(--color-secondary) hover:text-(--color-secondary-content)"
      }`}
    >
      <span>{tab.icon}</span>
      <span>{tab.name}</span>
    </li>
  );

  return (
    <div className="h-full flex flex-col">
      <ul className="space-y-4 flex-1">
        {mainTabs.map((tab) => renderTab(tab))}
      </ul>

      <ul className="space-y-4 border-t border-(--color-secondary) py-3">
        {renderTab(settingsTab)}
      </ul>
    </div>
  );
};

export default RestaurantSidebar;