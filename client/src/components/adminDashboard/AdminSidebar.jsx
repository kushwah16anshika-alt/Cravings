

import React from "react";
import {
  MdOutlineDashboard,
  MdOutlineFastfood,
} from "react-icons/md";
import { PiListHeartLight } from "react-icons/pi";
import { BsPersonGear } from "react-icons/bs";

const menuItems = [
  {
    name: "Overview",
    icon: <MdOutlineDashboard />,
  },
  {
    name: "Orders",
    icon: <MdOutlineFastfood />,
  },
  {
    name: "WishList",
    icon: <PiListHeartLight />,
  },
  {
    name: "Settings",
    icon: <BsPersonGear />,
  },
];

const AdminSidebar = ({ active, setActive }) => {
  return (
    <div className="bg-orange-500 text-white h-full p-5 rounded-xl">

      <h2 className="text-2xl font-bold text-center mb-8">
        User Dashboard
      </h2>

      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => setActive(item.name)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg mb-3 ${
            active === item.name
              ? "bg-white text-orange-500"
              : "hover:bg-orange-400"
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span>{item.name}</span>
        </button>
      ))}

    </div>
  );
};

export default AdminSidebar;