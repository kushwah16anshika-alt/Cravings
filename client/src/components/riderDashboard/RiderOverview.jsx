import React from "react";
import { FiShoppingBag, FiCreditCard, FiClock } from "react-icons/fi";

const RiderOverview = () => {
  const stats = [
    {
      title: "Total Orders",
      value: "12",
      icon: FiShoppingBag,
    },
    {
      title: "Total Spent",
      value: "₹20,450",
      icon: FiCreditCard,
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-3">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Rider Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Track your orders and spending activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {stats.map(({ title, value, icon: Icon }) => (
          <div key={title} className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className="text-4xl font-bold text-gray-900 mt-2">{value}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[var(--accent)] flex items-center justify-center">
                <Icon size={26} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <p className="text-sm text-gray-500 mt-1">Your latest delivery records</p>
          </div>
          <button className="text-sm font-medium text-[var(--accent)] hover:underline">View all</button>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center">
            <FiClock size={30} />
          </div>
          <p className="mt-4 font-semibold text-gray-800">No recent orders</p>
          <p className="text-sm text-gray-500 mt-1">Your delivery history will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default RiderOverview;