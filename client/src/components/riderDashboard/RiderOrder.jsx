import React from "react";
import {
  FiPackage,
  FiCheckCircle,
  FiTruck,
  FiClock,
  FiPlus,
} from "react-icons/fi";

const RiderOrders = () => {
  const columns = [
    {
      title: "New Orders",
      count: 0,
      icon: <FiPackage />,
    },
    {
      title: "Accepted",
      count: 0,
      icon: <FiCheckCircle />,
    },
    {
      title: "Delivering",
      count: 0,
      icon: <FiTruck />,
    },
    {
      title: "Completed",
      count: 0,
      icon: <FiClock />,
    },
  ];

  return (
    <div className="h-full overflow-y-auto">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Delivery Board
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your delivery workflow in real time.
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {columns.map((item) => (
          <div
            key={item.title}
            className="
              bg-white
              rounded-3xl
              border border-gray-200
              overflow-hidden
            "
          >

            <div className="
              flex items-center justify-between
              p-5
              border-b border-gray-100
            ">
              <div className="flex items-center gap-3">

                <div className="
                  w-10 h-10
                  rounded-xl
                  bg-orange-50
                  text-[var(--accent)]
                  flex items-center justify-center
                ">
                  {item.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {item.count} orders
                  </p>
                </div>

              </div>

            </div>


            <div className="
              min-h-[250px]
              p-5
              flex
              flex-col
              items-center
              justify-center
              text-center
            ">

              <div className="
                w-14 h-14
                rounded-2xl
                bg-gray-100
                flex items-center justify-center
                text-gray-400
                text-xl
              ">
                {item.icon}
              </div>


              <p className="
                mt-4
                text-sm
                font-medium
                text-gray-600
              ">
                No {item.title.toLowerCase()}
              </p>


              <p className="
                text-xs
                text-gray-400
                mt-1
              ">
                Orders will appear here
              </p>

            </div>

          </div>
        ))}

      </div>


      <div className="
        mt-6
        bg-white
        rounded-3xl
        border border-gray-200
        p-6
      ">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="font-bold text-xl text-gray-900">
              Quick Actions
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage your delivery preferences
            </p>
          </div>


          <button
            className="
              flex items-center gap-2
              px-5 py-3
              rounded-xl
              bg-[var(--accent)]
              text-white
              font-medium
            "
          >
            <FiPlus />
            New Request
          </button>

        </div>

      </div>

    </div>
  );
};

export default RiderOrders;