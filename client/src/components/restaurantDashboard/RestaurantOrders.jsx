import React from "react";

const RestaurantOrders = () => {
  const mockOrders = [
    {
      id: "#CRV-1001",
      customer: "Rahul Sharma",
      amount: "₹450",
      status: "Delivered",
      date: "10-07-2026",
    },
    {
      id: "#CRV-1002",
      customer: "Priya Verma",
      amount: "₹320",
      status: "Preparing",
      date: "10-07-2026",
    },
    {
      id: "#CRV-1003",
      customer: "Aman Gupta",
      amount: "₹780",
      status: "Delivered",
      date: "09-07-2026",
    },
    {
      id: "#CRV-1004",
      customer: "Neha Singh",
      amount: "₹560",
      status: "Cancelled",
      date: "09-07-2026",
    },
    {
      id: "#CRV-1005",
      customer: "Rohan Patel",
      amount: "₹1,150",
      status: "Delivered",
      date: "08-07-2026",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border border-green-300";
      case "Preparing":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-(--color-base-100)">
      {/* Header */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold">🍽 Restaurant Orders</h2>
        <p className="mt-2 opacity-90">
          Manage and track all customer orders.
        </p>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-(--color-base-200) shadow-xl overflow-hidden">
        <div className="p-5 border-b border-(--color-secondary)">
          <h3 className="text-xl font-bold">Recent Orders</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {mockOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`transition-all duration-300 hover:bg-orange-50 hover:scale-[1.01]
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  `}
                >
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
                      {order.id}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-medium">
                    👤 {order.customer}
                  </td>

                  <td className="px-6 py-4 text-lg font-bold text-green-600">
                    {order.amount}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    📅 {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOrders;