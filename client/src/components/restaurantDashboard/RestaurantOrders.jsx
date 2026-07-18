import React from "react";

const RestaurantOrders = () => {
  const mockOrders = [
    {
      id: "#ORD-1001",
      customer: "John Doe",
      amount: "$45.00",
      status: "Delivered",
      date: "2026-07-10",
    },
    {
      id: "#ORD-1002",
      customer: "Jane Smith",
      amount: "$32.50",
      status: "Preparing",
      date: "2026-07-10",
    },
    {
      id: "#ORD-1003",
      customer: "Bob Johnson",
      amount: "$18.75",
      status: "Delivered",
      date: "2026-07-09",
    },
    {
      id: "#ORD-1004",
      customer: "Alice Brown",
      amount: "$55.20",
      status: "Cancelled",
      date: "2026-07-09",
    },
    {
      id: "#ORD-1005",
      customer: "Charlie Davis",
      amount: "$22.00",
      status: "Delivered",
      date: "2026-07-08",
    },
  ];

  return (
    <div className="overflow-y-auto h-full p-2">
      <h2 className="text-2xl font-bold mb-6">Restaurant Orders</h2>

      <div className="bg-(--color-base-200) p-5 rounded-xl">
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

                <th className="text-left py-3 text-sm text-(--color-neutral)">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {mockOrders.map((order) => (
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

                  <td className="py-3 text-sm">{order.date}</td>
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
