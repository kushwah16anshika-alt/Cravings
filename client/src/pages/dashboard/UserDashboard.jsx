import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from"../../components/userDashboard/Sidebar";
import Overview from "../../components/userDashboard/Overview";
import Order from "../../components/userDashboard/Order";
import Setting from "../../components/userDashboard/Setting";
import Wishlist from "../../components/userDashboard/Wishlist";

// const UserDashboard = () => {
//   const { user } = useAuth();
//   const [active, setActive] = useState("Overview");

//   return (
//     <>
//       <div className="flex h-[92vh]">
//         <div className="w-1/6 border border-red-500 h-full">
//           <Sidebar active={active} setActive={setActive} />
//         </div>

//         <div className="w-5/6 border border-green-500 h-full">
//           {active === "Overview" && <Overview user={user} />}
//           {active === "Orders" && <Orders />}
//           {active === "WishList" && <Wishlist />}
//           {active === "Settings" && <Settings user={user} />}
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserDashboard;




// import React, { useState } from "react";
// import Sidebar from "../../components/userDashboard/Sidebar";
// import Overview from "../../components/userDashboard/Overview";
// import Orders from "../../components/userDashboard/Orders";
// import Settings from "../../components/userDashboard/Settings";
// import WishList from "../../components/userDashboard/WishList";

const UserDashboard = () => {
  const [active, setActive] = useState("Overview");

  return (
    <>
      <div className="flex h-[92vh]">
        <div className="w-1/6 border border-red-500 h-full">
          <Sidebar active={active} setActive={setActive} />
        </div>

        <div className="w-5/6 border border-green-500 h-full p-3">
          {active === "Overview" && <Overview />}
          {active === "Order" && <Order />}
          {active === "WishList" && <Wishlist />}
          {active === "Settings" && <Setting />}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;