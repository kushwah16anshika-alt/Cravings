import React, { useEffect, useState, useMemo, useCallback } from "react";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import Loader from "../Loader";
import {
  IoSearch,
  IoClose,
  IoReceiptOutline,
  IoLocationOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import { MdRefresh } from "react-icons/md";

const ORDER_STATUSES = [
  { value: "all", label: "All Orders" },
  { value: "active", label: "Live Active" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "preparing", label: "Preparing" },
  { value: "outForDelivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusBadge = (status) => {
  switch (status) {
    case "delivered":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "preparing":
    case "accepted":
    case "ready":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "outForDelivery":
    case "onTheWay":
    case "pickedUp":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "cancelled":
    case "failed":
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/admin/orders?status=${selectedStatus}`);
      if (res.data?.success) {
        setOrders(res.data.data || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Client-side search filter
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase().trim();
    return orders.filter(
      (o) =>
        o._id?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.restaurantName?.toLowerCase().includes(q) ||
        o.customerPhone?.includes(q)
    );
  }, [orders, searchQuery]);

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setIsUpdatingStatus(true);
      const res = await api.patch(`/admin/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });

      if (res.data?.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        if (selectedOrderDetails?._id === orderId) {
          setSelectedOrderDetails((prev) => ({ ...prev, orderStatus: newStatus }));
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
            Platform Orders Management
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Live stream of customer orders, delivery tracking, and administrative overrides
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-2xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
        >
          <MdRefresh size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600 text-base" />
            <input
              type="text"
              placeholder="Search by Order ID, Student Name, Kitchen, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
            />
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {ORDER_STATUSES.map((status) => {
            const active = selectedStatus === status.value;
            return (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                  active
                    ? "bg-orange-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {status.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12">
            <Loader height="200px" width="100%" text="Fetching platform orders..." />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <span className="text-4xl">🍽️</span>
            <p className="text-sm font-bold text-slate-700">No matching orders found</p>
            <p className="text-xs text-slate-400">
              Try adjusting your filter chips or search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-6">
                  <th className="py-3.5 pl-6">Order ID</th>
                  <th className="py-3.5">Student / Customer</th>
                  <th className="py-3.5">Campus Kitchen</th>
                  <th className="py-3.5">Items</th>
                  <th className="py-3.5">Amount</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5">Placed At</th>
                  <th className="py-3.5 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 pl-6 font-mono text-[11px] font-bold text-slate-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-4">
                      <div className="font-bold text-slate-900">
                        {order.customerName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {order.customerPhone || order.customerEmail}
                      </div>
                    </td>
                    <td className="py-4 font-bold text-slate-800">
                      {order.restaurantName}
                    </td>
                    <td className="py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-700">
                        {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                      </span>
                    </td>
                    <td className="py-4 font-heading text-sm font-black text-slate-900">
                      ₹{order.finalAmount}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase border ${statusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 text-[11px] text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      •{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedOrderDetails(order)}
                        className="rounded-xl bg-orange-50 text-orange-600 border border-orange-200/80 px-3 py-1.5 text-xs font-bold hover:bg-orange-600 hover:text-white transition shadow-xs"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl my-6 rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                  <IoReceiptOutline size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-black">
                    Order Details #{selectedOrderDetails._id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-xs text-orange-100 font-medium">
                    Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition"
              >
                <IoClose size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Status Updater Bar */}
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Current Order Status
                  </span>
                  <div className="mt-0.5">
                    <span
                      className={`inline-block px-3 py-1 rounded-xl text-xs font-black uppercase border ${statusBadge(
                        selectedOrderDetails.orderStatus
                      )}`}
                    >
                      {selectedOrderDetails.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">Override:</label>
                  <select
                    value={selectedOrderDetails.orderStatus}
                    onChange={(e) =>
                      handleUpdateStatus(selectedOrderDetails._id, e.target.value)
                    }
                    disabled={isUpdatingStatus}
                    className="text-xs font-bold px-3 py-2 rounded-xl bg-white border border-slate-300 focus:outline-hidden focus:border-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="pickedUp">Picked Up</option>
                    <option value="onTheWay">On The Way</option>
                    <option value="outForDelivery">Out For Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* 2-Column Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Kitchen Info */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-slate-400">
                    <IoStorefrontOutline size={14} />
                    <span>Campus Kitchen</span>
                  </div>
                  <h4 className="font-heading text-sm font-black text-slate-900">
                    {selectedOrderDetails.restaurantName}
                  </h4>
                  {selectedOrderDetails.restaurantPhone && (
                    <p className="text-xs text-slate-500">
                      Contact: {selectedOrderDetails.restaurantPhone}
                    </p>
                  )}
                </div>

                {/* Customer & Delivery Address */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-slate-400">
                    <IoLocationOutline size={14} />
                    <span>Delivery Spot</span>
                  </div>
                  <h4 className="font-heading text-sm font-black text-slate-900">
                    {selectedOrderDetails.deliveryAddress?.name || selectedOrderDetails.customerName}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {[
                      selectedOrderDetails.deliveryAddress?.address,
                      selectedOrderDetails.deliveryAddress?.city,
                      selectedOrderDetails.deliveryAddress?.pinCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {selectedOrderDetails.customerPhone && (
                    <p className="text-xs font-bold text-orange-600">
                      Student Tel: {selectedOrderDetails.customerPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-3">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ordered Dishes ({selectedOrderDetails.orderItems?.length || 0})
                </h4>

                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                  {selectedOrderDetails.orderItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 flex items-center justify-between text-xs font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {item.itemName}
                        </span>
                        <span className="text-slate-400">× {item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-900">
                        ₹{(item.price || 0) * (item.quantity || 1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Details Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Items Total</span>
                  <span>₹{selectedOrderDetails.billDetails?.totalAmount || 0}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Platform Fee</span>
                  <span>₹{selectedOrderDetails.billDetails?.platformFee || 0}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Taxes & GST (5%)</span>
                  <span>₹{selectedOrderDetails.billDetails?.taxAmount || 0}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-heading font-black text-sm text-slate-900">
                  <span>Final Paid Amount</span>
                  <span className="text-orange-600">
                    ₹{selectedOrderDetails.finalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;