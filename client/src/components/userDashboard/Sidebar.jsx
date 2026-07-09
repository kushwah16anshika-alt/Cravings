
// import React from "react";
// import { MdOutlineDashboard, MdOutlineFastfood } from "react-icons/md";
// import { PiListHeartLight } from "react-icons/pi";
// import { BsPersonGear } from "react-icons/bs";

// const MenuItems = [
//   { name: "Overview", icon: <MdOutlineDashboard /> },
//   { name: "Orders", icon: <MdOutlineFastfood /> },
//   { name: "WishList", icon: <PiListHeartLight /> },
//   { name: "Settings", icon: <BsPersonGear /> },
// ];

// const Sidebar = ({ active, setActive }) => {
//   return (
//     <div className="p-3">
//       <div className="border-b-2 text-center text-xl pb-2">
//         User Dashboard
//       </div>

//       <div className="space-y-2 mt-4">
//         {MenuItems.map((item, idx) => (
//           <button
//             key={idx}
//             onClick={() => setActive(item.name)}
//             className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold border border-transparent hover:border-[var(--primary)]
//               ${
//                 active === item.name
//                   ? "bg-[var(--secondary)] text-[var(--primary-text)]"
//                   : ""
//               }`}
//           >
//             {item.icon}
//             <span>{item.name}</span>
//           </button>
//         ))}
//       </div>
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

const Sidebar = ({ active, setActive }) => {
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

export default Sidebar;