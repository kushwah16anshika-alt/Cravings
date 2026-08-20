import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import api from "../../config/ApiConfig";
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
          "Unknown error occurred during fetching orders. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (isLoading) {
    return <Loader height="100%" width="100%" />;
  }

  return (
    <div className="overflow-y-auto h-full">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      <div className="bg-(--color-base-200) p-4 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--color-secondary)">
              <th className="text-left py-2">Order ID</th>
              <th className="text-left py-2">Restaurant</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-(--color-secondary)"
                >
                  <td className="py-3">{order._id}</td>
                  <td className="py-3">
                    {order.restaurant?.name || "N/A"}
                  </td>
                  <td className="py-3">
                    ₹{order.totalAmount || order.amount || 0}
                  </td>
                  <td className="py-3">
                    {order.status || "Pending"}
                  </td>
                  <td className="py-3">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-(--color-neutral)"
                >
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;