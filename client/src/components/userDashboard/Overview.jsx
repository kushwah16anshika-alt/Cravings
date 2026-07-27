import React from "react";
import { FaShoppingBag, FaWallet, FaCheckCircle } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";

const Overview = () => {

  const recentOrders = [
    {
      id: "#CRV-5001",
      restaurant: "Spice Villa",
      amount: "₹450",
      status: "Delivered",
    },
    {
      id: "#CRV-5002",
      restaurant: "Food Junction",
      amount: "₹320",
      status: "Preparing",
    },
    {
      id: "#CRV-5003",
      restaurant: "The Pizza House",
      amount: "₹780",
      status: "Delivered",
    },
  ];


  return (

    <div
      className="
      overflow-y-auto
      h-full
      p-2
      bg-gradient-to-br
      from-orange-50
      via-white
      to-red-50
      "
    >


      <h2
        className="
        text-3xl
        font-extrabold
        text-orange-600
        mb-6
        "
      >
        👋 Customer Overview
      </h2>





      {/* Stats Cards */}

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-5
        mb-8
        "
      >


        {/* Orders */}

        <div
          className="
          bg-white
          rounded-2xl
          p-5
          shadow-lg
          border
          border-orange-100
          hover:scale-105
          transition
          "
        >

          <div
            className="
            w-12
            h-12
            rounded-xl
            bg-orange-100
            flex
            items-center
            justify-center
            text-orange-600
            text-xl
            "
          >
            <FaShoppingBag/>
          </div>


          <p className="text-gray-500 mt-4">
            Total Orders
          </p>


          <h3 className="text-3xl font-bold text-gray-800">
            12
          </h3>


        </div>





        {/* Spending */}

        <div
          className="
          bg-white
          rounded-2xl
          p-5
          shadow-lg
          border
          border-green-100
          hover:scale-105
          transition
          "
        >

          <div
            className="
            w-12
            h-12
            rounded-xl
            bg-green-100
            flex
            items-center
            justify-center
            text-green-600
            text-xl
            "
          >
            <FaWallet/>
          </div>


          <p className="text-gray-500 mt-4">
            Total Spent
          </p>


          <h3 className="text-3xl font-bold text-gray-800">
            ₹12,450
          </h3>


        </div>





        {/* Completed */}

        <div
          className="
          bg-white
          rounded-2xl
          p-5
          shadow-lg
          border
          border-blue-100
          hover:scale-105
          transition
          "
        >

          <div
            className="
            w-12
            h-12
            rounded-xl
            bg-blue-100
            flex
            items-center
            justify-center
            text-blue-600
            text-xl
            "
          >
            <FaCheckCircle/>
          </div>


          <p className="text-gray-500 mt-4">
            Delivered Orders
          </p>


          <h3 className="text-3xl font-bold text-gray-800">
            9
          </h3>


        </div>


      </div>






      {/* Recent Orders */}

      <div
        className="
        bg-white
        rounded-3xl
        shadow-lg
        p-6
        border
        border-orange-100
        "
      >


        <div className="flex items-center gap-3 mb-5">


          <div
            className="
            w-10
            h-10
            rounded-xl
            bg-orange-100
            flex
            items-center
            justify-center
            text-orange-600
            "
          >
            <MdPendingActions size={22}/>
          </div>


          <h3 className="
          text-xl
          font-bold
          text-gray-800
          ">
            Recent Orders
          </h3>


        </div>




        <div className="overflow-x-auto">


          <table className="w-full">


            <thead>

              <tr
                className="
                border-b
                text-gray-500
                text-sm
                "
              >

                <th className="text-left py-3">
                  Order ID
                </th>

                <th className="text-left py-3">
                  Restaurant
                </th>

                <th className="text-left py-3">
                  Amount
                </th>

                <th className="text-left py-3">
                  Status
                </th>

              </tr>

            </thead>



            <tbody>


              {
                recentOrders.map((order)=>(

                  <tr
                    key={order.id}
                    className="
                    border-b
                    hover:bg-orange-50
                    transition
                    "
                  >

                    <td className="py-4 font-medium">
                      {order.id}
                    </td>


                    <td className="py-4">
                      {order.restaurant}
                    </td>


                    <td className="
                    py-4
                    font-bold
                    text-green-600
                    ">
                      {order.amount}
                    </td>


                    <td className="py-4">


                      <span
                        className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-bold

                        ${
                          order.status==="Delivered"
                          ?
                          "bg-green-100 text-green-700"
                          :
                          "bg-yellow-100 text-yellow-700"
                        }
                        `}
                      >

                        {order.status}

                      </span>


                    </td>


                  </tr>


                ))
              }


            </tbody>


          </table>


        </div>


      </div>



    </div>

  );
};


export default Overview;