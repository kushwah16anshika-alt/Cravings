import React from "react";

const RestaurantOverview = () => {
  const recentOrders = [
    {
      id: "#ORD-1001",
      customer: "John Doe",
      amount: "$45.00",
      status: "Delivered",
    },
    {
      id: "#ORD-1002",
      customer: "Jane Smith",
      amount: "$32.50",
      status: "Preparing",
    },
    {
      id: "#ORD-1003",
      customer: "Bob Johnson",
      amount: "$18.75",
      status: "Delivered",
    },
  ];

  return (
    <div className="overflow-y-auto h-full p-2">
      <h2 className="text-2xl font-bold mb-6">Restaurant Overview</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-(--color-base-200) p-5 rounded-xl">
          <p className="text-(--color-neutral) text-sm">Total Orders</p>

          <p className="text-3xl font-bold mt-2">12</p>
        </div>

        <div className="bg-(--color-base-200) p-5 rounded-xl">
          <p className="text-(--color-neutral) text-sm">Total Sales</p>

          <p className="text-3xl font-bold mt-2">$440.00</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-(--color-base-200) p-5 rounded-xl">
        <h3 className="font-semibold mb-4 text-lg">Recent Orders</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--color-secondary)">
                <th className="text-left py-3 text-sm text-(--color-neutral)">
                  Order ID
                </th>

                <th className="text-left py-3 text-sm text-(--color-neutral)">
                  Customer
                </th>

                <th className="text-left py-3 text-sm text-(--color-neutral)">
                  Amount
                </th>

                <th className="text-left py-3 text-sm text-(--color-neutral)">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-(--color-secondary) last:border-0 hover:bg-(--color-base-100) transition"
                >
                  <td className="py-3 text-sm">{order.id}</td>

                  <td className="py-3 text-sm">{order.customer}</td>

                  <td className="py-3 text-sm font-semibold">{order.amount}</td>

                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Preparing"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
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
