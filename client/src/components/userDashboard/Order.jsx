import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true);

      const res = await api.get("/customer/all-orders");

      setOrders(res.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch orders. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (isLoading) {
    return <Loader height="300px" width="100%" text="Fetching your orders..." />;
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "accepted":
      case "preparing":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Orders</h2>
          <p className="text-sm text-slate-500">Track and view your recent culinary experiences</p>
        </div>
      </div>

      <div className="bg-(--color-base-100) rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Restaurant</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {orders.length > 0 ? (
                orders.map((order) => {
                  const restaurantName =
                    order.restaurantId?.restaurantName ||
                    order.restaurant?.name ||
                    "Restaurant Partner";
                  const amount =
                    order.billDetails?.finalAmount ||
                    order.totalAmount ||
                    0;
                  const status =
                    order.orderStatus || order.status || "pending";
                  const itemsCount =
                    order.orderItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) ||
                    order.items?.length ||
                    1;

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition"
                    >
                      <td className="py-4 px-4 font-mono text-xs font-medium text-slate-500">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">
                        {restaurantName}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">
                        {itemsCount} {itemsCount === 1 ? "item" : "items"}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                        ₹{amount}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getStatusBadge(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-12 text-slate-400 font-medium"
                  >
                    No orders placed yet. Explore restaurants and satisfy your cravings!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Order;