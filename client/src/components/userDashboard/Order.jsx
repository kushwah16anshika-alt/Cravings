import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  IoStorefrontOutline,
  IoTimeOutline,
  IoCheckmarkCircle,
  IoFastFoodOutline,
  IoChevronDown,
  IoChevronUp,
} from "react-icons/io5";
import { MdOutlineRestaurantMenu, MdDeliveryDining } from "react-icons/md";

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
        <h2 className="font-heading text-2xl font-black text-slate-900">
          My Order History
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-500">
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
                className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden transition"
              >
                {/* Order Summary Header */}
                <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 flex-shrink-0">
                      <IoStorefrontOutline size={24} />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-black text-slate-900">
                        {restaurantName}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400">
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
                      <p className="font-heading text-lg font-black text-slate-900">
                        ₹{order.billDetails?.finalAmount || 0}
                      </p>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isFailed
                            ? "bg-red-100 text-red-700"
                            : order.orderStatus === "delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {order.orderStatus || "Pending"}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-600 transition"
                    >
                      {isExpanded ? <IoChevronUp size={18} /> : <IoChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Live Tracking Visual Stepper (if not failed) */}
                {!isFailed && order.orderStatus !== "delivered" && (
                  <div className="p-5 sm:p-6 bg-orange-50/50 border-b border-slate-100">
                    <p className="text-xs font-black uppercase tracking-widest text-orange-700 mb-4 flex items-center gap-1.5">
                      <MdDeliveryDining size={18} />
                      <span>Live Order Status</span>
                    </p>

                    <div className="grid grid-cols-5 gap-2 relative">
                      {ORDER_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={step.key} className="flex flex-col items-center text-center">
                            <div
                              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                isDone
                                  ? "bg-orange-600 text-white shadow-xs"
                                  : "bg-slate-200 text-slate-400"
                              } ${isCurrent ? "ring-4 ring-orange-500/20 scale-110" : ""}`}
                            >
                              {isDone ? "✓" : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] mt-1.5 font-extrabold ${
                                isDone ? "text-slate-900" : "text-slate-400"
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
                  <div className="p-5 sm:p-6 bg-slate-50/70 space-y-4">
                    <h4 className="font-heading text-xs font-black uppercase tracking-wider text-slate-500">
                      Dishes Ordered ({order.orderItems?.length || 0})
                    </h4>

                    <div className="divide-y divide-slate-200/60 bg-white rounded-2xl p-4 border border-slate-200/80">
                      {order.orderItems?.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs font-bold text-slate-700"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded-md bg-orange-100 text-orange-700 flex items-center justify-center font-black text-[10px]">
                              {item.quantity || 1}x
                            </span>
                            <span>{item.itemName || "Delicious Item"}</span>
                          </div>
                          <span className="text-slate-900">
                            ₹{(item.price || 0) * (item.quantity || 1)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs font-bold text-slate-500">
                        Delivery to: <span className="text-slate-700">{order.deliveryAddress?.address || "Campus Address"}</span>
                      </p>

                      {restId && (
                        <Link
                          to={`/restaurant-details/${restId}`}
                          className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-black text-white hover:bg-orange-500 transition shadow-xs"
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
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
          <span className="text-5xl">🍴</span>
          <h3 className="font-heading text-xl font-bold text-slate-900 mt-4">
            No orders placed yet
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Browse our campus kitchens and place your first delicious order!
          </p>
          <Link
            to="/order-now"
            className="inline-block mt-5 px-6 py-2.5 rounded-2xl bg-orange-600 text-white font-black text-xs shadow-md shadow-orange-600/30 hover:bg-orange-500 transition"
          >
            Explore Menu Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default Order;