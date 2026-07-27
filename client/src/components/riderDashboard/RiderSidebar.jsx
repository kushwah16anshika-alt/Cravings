// import React from "react";
// import { MdDashboard } from "react-icons/md";
// import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
// import { IoMdSettings } from "react-icons/io";

// const RiderSidebar = ({ activeTab, setActiveTab }) => {
//   const tabs = [
//     {
//       name: "Overview",
//       value: "overview",
//       icon: <MdDashboard size={20} />,
//     },
//     {
//       name: "Orders",
//       value: "orders",
//       icon: <FaShoppingCart size={18} />,
//     },
//     {
//       name: "Profile",
//       value: "profile",
//       icon: <FaUserCircle size={18} />,
//     },
//   ];

//   const settingsTab = {
//     name: "Settings",
//     value: "settings",
//     icon: <IoMdSettings size={20} />,
//   };

//   const renderTab = (tab) => (
//     <li
//       key={tab.value}
//       onClick={() => setActiveTab(tab.value)}
//       className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
//         activeTab === tab.value
//           ? "bg-[var(--primary)] text-white shadow-md"
//           : "text-gray-700 hover:bg-orange-50 hover:text-[var(--accent)]"
//       }`}
//     >
//       <span>{tab.icon}</span>
//       <span className="font-medium">{tab.name}</span>
//     </li>
//   );

//   return (
//     <aside className="h-full flex flex-col bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
//       <div className="pb-6 border-b border-gray-200">
//         <h2 className="text-2xl font-bold text-[var(--primary)] text-center">
//           Rider Panel
//         </h2>

//         <p className="text-sm text-gray-500 text-center mt-1">
//           Dashboard
//         </p>
//       </div>

//       <ul className="flex-1 mt-6 space-y-3">
//         {tabs.map(renderTab)}
//       </ul>

//       <div className="pt-6 border-t border-gray-200">
//         <ul>{renderTab(settingsTab)}</ul>
//       </div>
//     </aside>
//   );
// };

// export default RiderSidebar;


import React from "react";
import { MdDashboard } from "react-icons/md";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";

const RiderSidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const tabs = [
    {
      name: "Overview",
      value: "overview",
      icon: <MdDashboard size={20} />,
    },
    {
      name: "Orders",
      value: "orders",
      icon: <FaShoppingCart size={18} />,
    },
    {
      name: "Profile",
      value: "profile",
      icon: <FaUserCircle size={18} />,
    },
    {
      name: "Settings",
      value: "settings",
      icon: <IoMdSettings size={20} />,
    },
  ];

  return (
    <aside className="h-full bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden">

      {/* Header */}

      <div className="bg-orange-500 rounded-t-3xl px-6 py-8 text-center">

        <img
          src={
            user?.photo?.url ||
            "https://via.placeholder.com/100"
          }
          alt="Profile"
          className="
          w-20 h-20
          rounded-full
          border-4
          border-white
          object-cover
          mx-auto
          shadow-lg
          "
        />

        <h2 className="mt-4 text-xl font-bold text-white">
          {user?.fullName || "Rider"}
        </h2>

        <p className="text-orange-100 text-sm">
          Delivery Partner
        </p>

      </div>


      {/* Navigation */}

      <div className="flex-1 p-5">

        <ul className="space-y-3">

          {tabs.map((tab) => (

            <li
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`
              relative
              flex
              items-center
              gap-4
              px-5
              py-4
              rounded-2xl
              cursor-pointer
              transition-all
              duration-300

              ${
                activeTab === tab.value
                ?
                "bg-orange-500 text-white shadow-lg shadow-orange-200"
                :
                "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
              }

              `}
            >

              {
                activeTab === tab.value && (
                  <span
                    className="
                    absolute
                    left-0
                    top-3
                    bottom-3
                    w-1
                    rounded-r-full
                    bg-white
                    "
                  />
                )
              }


              <span>
                {tab.icon}
              </span>


              <span className="font-medium">
                {tab.name}
              </span>


            </li>

          ))}

        </ul>

      </div>


      {/* Footer */}

      <div className="px-6 py-5 border-t border-gray-200">

        <div className="text-center text-xs text-gray-400">

          <p className="tracking-[0.3em]">
            CRAVINGS RIDER
          </p>

          <p className="mt-2">
            Version 1.0
          </p>

        </div>

      </div>


    </aside>
  );
};

export default RiderSidebar;