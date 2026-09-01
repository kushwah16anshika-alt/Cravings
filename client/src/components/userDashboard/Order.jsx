import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  IoStorefrontOutline,
  IoChevronDown,
  IoChevronUp,
} from "react-icons/io5";
import { MdDeliveryDining } from "react-icons/md";

const ORDER_STEPS = [
  { key: "pending", label: "Placed" },
  { key: "accepted", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "outForDelivery", label: "On the Way" },
  { key: "delivered", label: "Delivered" },
];

const getStepIndex = (status) => {
  const norm = (status || "").toLowerCase();
  if (norm === "delivered") return 4;
  if (norm === "outfordelivery" || norm === "ontheway" || norm === "pickedup") return 3;
  if (norm === "preparing" || norm === "ready") return 2;
  if (norm === "accepted") return 1;
  return 0; // pending
};

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/customer/all-orders");
      setOrders(res.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch orders. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (isLoading) {
    return <Loader height="300px" width="100%" text="Fetching your order history..." />;
  }

  const toggleExpand = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
          Order History
        </h2>
        <p className="text-xs sm:text-sm font-normal text-slate-500">
          Track live deliveries and view past campus dining orders
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const currentStep = getStepIndex(order.orderStatus);
            const isFailed = ["cancelled", "failed", "rejected"].includes(
              (order.orderStatus || "").toLowerCase()
            );
            const isExpanded = expandedOrderId === order._id;

            const restaurantName =
              order.restaurantId?.restaurantName || "Campus Kitchen";
            const restId = order.restaurantId?._id || order.restaurantId;

            return (
              <div
                key={order._id}
                className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden transition"
              >
                {/* Order Summary Header */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100/80 flex-shrink-0">
                      <IoStorefrontOutline size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm font-bold text-slate-900">
                        {restaurantName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Order #{order._id.slice(-6).toUpperCase()} •{" "}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Recently"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <p className="font-heading text-base font-bold text-slate-900">
                        ₹{order.billDetails?.finalAmount || 0}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          isFailed
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : order.orderStatus === "delivered"
                            ? "bg-slate-100 text-slate-700 border border-slate-200"
                            : "bg-orange-50 text-orange-700 border border-orange-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isFailed
                              ? "bg-red-500"
                              : order.orderStatus === "delivered"
                              ? "bg-emerald-500"
                              : "bg-orange-500"
                          }`}
                        />
                        {order.orderStatus || "Pending"}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition"
                    >
                      {isExpanded ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Live Tracking Visual Stepper (if not failed) */}
                {!isFailed && order.orderStatus !== "delivered" && (
                  <div className="p-5 bg-orange-50/40 border-b border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-800 mb-4 flex items-center gap-1.5">
                      <MdDeliveryDining size={16} />
                      <span>Live Order Status</span>
                    </p>

                    <div className="grid grid-cols-5 gap-2 relative">
                      {ORDER_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={step.key} className="flex flex-col items-center text-center">
                            <div
                              className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                isDone
                                  ? "bg-orange-600 text-white shadow-xs"
                                  : "bg-slate-200 text-slate-500"
                              } ${isCurrent ? "ring-2 ring-orange-500/30 scale-105" : ""}`}
                            >
                              {isDone ? "✓" : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] mt-1.5 font-medium ${
                                isDone ? "text-slate-900 font-bold" : "text-slate-400"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Expanded Details: Order Items & Actions */}
                {isExpanded && (
                  <div className="p-5 bg-slate-50/50 space-y-4">
                    <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-500">
                      Dishes Ordered ({order.orderItems?.length || 0})
                    </h4>

                    <div className="divide-y divide-slate-100 bg-white rounded-xl p-4 border border-slate-200/80">
                      {order.orderItems?.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs font-medium text-slate-700"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded-md bg-orange-50 text-orange-700 flex items-center justify-center font-bold text-[10px] border border-orange-100/80">
                              {item.quantity || 1}x
                            </span>
                            <span>{item.itemName || "Item"}</span>
                          </div>
                          <span className="text-slate-900 font-bold">
                            ₹{(item.price || 0) * (item.quantity || 1)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <p className="text-xs text-slate-500 font-medium">
                        Delivery to: <span className="text-slate-800 font-semibold">{order.deliveryAddress?.address || "Campus Address"}</span>
                      </p>

                      {restId && (
                        <Link
                          to={`/restaurant-details/${restId}`}
                          className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500 transition shadow-xs shadow-orange-600/20"
                        >
                          Order Again →
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 p-8 max-w-md mx-auto space-y-2">
          <h3 className="font-heading text-lg font-bold text-slate-900">
            No orders placed yet
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Browse our campus kitchens and place your first order.
          </p>
          <div className="pt-3">
            <Link
              to="/order-now"
              className="inline-block px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-sm shadow-orange-600/30 hover:bg-orange-500 transition"
            >
              Explore Menu Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;