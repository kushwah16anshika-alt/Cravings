import React from "react";
import { MdDashboard, MdFavoriteBorder } from "react-icons/md";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const Sidebar = ({ activeTab, setActiveTab }) => {

  const mainTabs = [
    {
      name: "Overview",
      value: "overview",
      icon: <MdDashboard size={22} />,
    },
    {
      name: "Orders",
      value: "orders",
      icon: <FaShoppingCart size={22} />,
    },
    {
      name: "Wishlist",
      value: "wishlist",
      icon: <MdFavoriteBorder size={22} />,
    },
  ];


  const settingsTab = {
    name: "Settings",
    value: "settings",
    icon: <IoMdSettings size={22} />,
  };



  const renderTab = (tab) => {
    const active = activeTab === tab.value;

    return (
      <li
        key={tab.value}
        onClick={() => setActiveTab(tab.value)}
        className={`
          flex
          items-center
          gap-3
          px-4
          py-3
          rounded-xl
          cursor-pointer
          transition-all
          duration-300
          font-medium

          ${
            active
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
              : "text-gray-600 hover:bg-orange-100 hover:text-orange-600"
          }
        `}
      >
        {tab.icon}
        <span>{tab.name}</span>
      </li>
    );
  };



  return (
    <div
      className="
      h-full
      flex
      flex-col
      bg-white
      rounded-2xl
      p-4
      shadow-md
      "
    >


      {/* Header */}

      <div
        className="
        mb-6
        p-4
        rounded-xl
        bg-gradient-to-r
        from-orange-500
        to-red-500
        text-white
        "
      >

        <div className="flex items-center gap-3">

          <FaUserCircle size={35} />

          <div>
            <h2 className="font-bold text-lg">
              Cravings
            </h2>

            <p className="text-sm">
              Customer Dashboard
            </p>
          </div>

        </div>

      </div>




      {/* Main Tabs */}

      <ul className="space-y-3 flex-1">

        {mainTabs.map((tab) => (
          renderTab(tab)
        ))}

      </ul>





      {/* Settings */}

      <div
        className="
        border-t
        border-gray-200
        pt-4
        "
      >

        {renderTab(settingsTab)}

      </div>


    </div>
  );
};


export default Sidebar;