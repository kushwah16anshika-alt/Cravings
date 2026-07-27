import React from "react";
import { FiShoppingBag, FiDollarSign, FiUser, FiCheckCircle } from "react-icons/fi";

const RestaurantOverview = () => {
  const recentOrders = [
    { id: "#CRV-1001", customer: "Rahul Sharma", amount: "₹450", status: "Delivered" },
    { id: "#CRV-1002", customer: "Priya Verma", amount: "₹320", status: "Preparing" },
    { id: "#CRV-1003", customer: "Aman Gupta", amount: "₹780", status: "Delivered" },
    { id: "#CRV-1004", customer: "Neha Singh", amount: "₹560", status: "Cancelled" },
    { id: "#CRV-1005", customer: "Rohan Patel", amount: "₹1,150", status: "Delivered" },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 bg-green-50";
      case "Preparing":
        return "text-yellow-600 bg-yellow-50";
      case "Cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Restaurant Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Monitor your orders and business activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h2 className="text-4xl font-bold mt-2">125</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600">
              <FiShoppingBag size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <h2 className="text-4xl font-bold mt-2">₹48,750</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600">
              <FiDollarSign size={28} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">
            Recent Orders
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Latest customer orders
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold">
                    {order.id}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-400" />
                      {order.customer}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-bold">
                    {order.amount}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
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

export default RestaurantOverview;