// import React from "react";
// import {
//   MdOutlineDashboard,
//   MdOutlineFastfood,
// } from "react-icons/md";
// import { PiListHeartLight } from "react-icons/pi";
// import { BsPersonGear } from "react-icons/bs";

// const menuItems = [
//   {
//     name: "Overview",
//     icon: <MdOutlineDashboard />,
//   },
//   {
//     name: "Orders",
//     icon: <MdOutlineFastfood />,
//   },
//   {
//     name: "WishList",
//     icon: <PiListHeartLight />,
//   },
//   {
//     name: "Settings",
//     icon: <BsPersonGear />,
//   },
// ];

// const Sidebar = ({ active, setActive }) => {
//   return (
//     <div className="bg-orange-500 text-white h-full p-5 rounded-xl">

//       <h2 className="text-2xl font-bold text-center mb-8">
//         User Dashboard
//       </h2>

//       {menuItems.map((item, index) => (
//         <button
//           key={index}
//           onClick={() => setActive(item.name)}
//           className={`w-full flex items-center gap-3 p-3 rounded-lg mb-3 ${
//             active === item.name
//               ? "bg-white text-orange-500"
//               : "hover:bg-orange-400"
//           }`}
//         >
//           <span className="text-xl">{item.icon}</span>
//           <span>{item.name}</span>
//         </button>
//       ))}

//     </div>
//   );
// };

// export default Sidebar;




import React from "react";
import {
  MdOutlineDashboard,
  MdOutlineFastfood,
} from "react-icons/md";
import { PiListHeartLight } from "react-icons/pi";
import { BsPersonGear } from "react-icons/bs";

const Sidebar = ({ active, setActive }) => {

  const mainTabs = [
    {
      name: "Overview",
      value: "Overview",
      icon: <MdOutlineDashboard />,
    },
    {
      name: "Orders",
      value: "Orders",
      icon: <MdOutlineFastfood />,
    },
    {
      name: "WishList",
      value: "WishList",
      icon: <PiListHeartLight />,
    },
  ];


  const settingsTab = {
    name: "Settings",
    value: "Settings",
    icon: <BsPersonGear />,
  };


  const renderTab = (tab) => (
    <li
      key={tab.value}
      className={`cursor-pointer p-3 rounded-lg flex items-center gap-3 text-(--color-neutral) ${
        active === tab.value
          ? "bg-(--color-primary) text-(--color-primary-content) font-semibold"
          : "hover:bg-(--color-secondary) hover:text-(--color-secondary-content) transition-colors duration-200"
      }`}
      onClick={() => setActive(tab.value)}
    >
      <span className="text-xl">
        {tab.icon}
      </span>

      <span>
        {tab.name}
      </span>

    </li>
  );


  return (
    <div className="h-full flex flex-col">

      {/* Dashboard Title */}
      <h2 className="text-xl font-bold text-center mb-8">
        User Dashboard
      </h2>


      {/* Main Menu */}
      <ul className="space-y-4 flex-1">

        {mainTabs.map((tab) =>
          renderTab(tab)
        )}

      </ul>


      {/* Settings */}
      <ul className="space-y-4 border-t border-(--color-secondary) py-3">

        {renderTab(settingsTab)}

      </ul>


    </div>
  );
};


export default Sidebar;