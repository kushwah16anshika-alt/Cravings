// import React from "react";
// import { MdDashboard, MdRestaurantMenu } from "react-icons/md";
// import { FaShoppingCart, FaStore } from "react-icons/fa";
// import { IoMdSettings } from "react-icons/io";

// const RestaurantSidebar = ({ activeTab, setActiveTab }) => {
//   const tabs = [
//     {
//       name: "Overview",
//       value: "overview",
//       icon: <MdDashboard size={20} />,
//     },
//     {
//       name: "Menu",
//       value: "menu",
//       icon: <MdRestaurantMenu size={20} />,
//     },
//     {
//       name: "Orders",
//       value: "orders",
//       icon: <FaShoppingCart size={18} />,
//     },
//     {
//       name: "Settings",
//       value: "settings",
//       icon: <IoMdSettings size={20} />,
//     },
//   ];

//   return (
//     <aside className="h-full bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden">

//       <div className="bg-orange-500 rounded-t-3xl px-6 py-8 text-center">
//         <div className="w-20 h-20 mx-auto rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-white shadow-lg">
//           <FaStore size={32} />
//         </div>

//         <h2 className="mt-4 text-xl font-bold text-white">
//           Cravings
//         </h2>

//         <p className="text-orange-100 text-sm">
//           Restaurant Panel
//         </p>
//       </div>

//       <div className="flex-1 p-5">
//         <ul className="space-y-3">
//           {tabs.map((tab) => (
//             <li
//               key={tab.value}
//               onClick={() => setActiveTab(tab.value)}
//               className={`
//                 relative
//                 flex
//                 items-center
//                 gap-4
//                 px-5
//                 py-4
//                 rounded-2xl
//                 cursor-pointer
//                 transition-all
//                 duration-300

//                 ${
//                   activeTab === tab.value
//                     ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
//                     : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
//                 }
//               `}
//             >
//               {activeTab === tab.value && (
//                 <span className="
//                   absolute
//                   left-0
//                   top-3
//                   bottom-3
//                   w-1
//                   rounded-r-full
//                   bg-white
//                 " />
//               )}

//               <span>
//                 {tab.icon}
//               </span>

//               <span className="font-medium">
//                 {tab.name}
//               </span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="px-6 py-5 border-t border-gray-200 text-center text-xs text-gray-400">
//         <p className="tracking-[0.3em]">
//           CRAVINGS RESTAURANT
//         </p>
//         <p className="mt-2">
//           Version 1.0
//         </p>
//       </div>

//     </aside>
//   );
// };

// export default RestaurantSidebar;



import React from "react";
import { MdDashboard, MdMenuBook } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const RestaurantSidebar = ({ activeTab, setActiveTab }) => {
  const mainTabs = [
    {
      name: "Overview",
      value: "overview",
      icon: <MdDashboard />,
    },
    {
      name: "Orders",
      value: "orders",
      icon: <FaShoppingCart />,
    },
    {
      name: "Menu",
      value: "menu",
      icon: <MdMenuBook />,
    },
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
      className={`
        cursor-pointer
        p-2
        rounded
        text-(--color-neutral)
        flex
        items-center
        gap-3
        transition-colors
        duration-200
        ${
          activeTab === tab.value
            ? "bg-(--color-primary) text-(--color-primary-content) font-semibold"
            : "hover:bg-(--color-secondary) hover:text-(--color-secondary-content)"
        }
      `}
    >
      {tab.icon}
      <span>{tab.name}</span>
    </li>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Main Tabs */}
      <ul className="space-y-4 flex-1">
        {mainTabs.map((tab) => renderTab(tab))}
      </ul>

      {/* Settings */}
      <ul className="space-y-4 border-t border-(--color-secondary) py-2">
        {renderTab(settingsTab)}
      </ul>
    </div>
  );
};

export default RestaurantSidebar;