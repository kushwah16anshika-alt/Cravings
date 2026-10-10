import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import OrderTrackingModal from "../orderTracking/OrderTrackingModal";
import {
  IoStorefrontOutline,
  IoChevronDown,
  IoChevronUp,
  IoMapOutline,
  IoCloseCircleOutline,
  IoStar,
  IoStarOutline,
} from "react-icons/io5";

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
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [ratingOrder, setRatingOrder] = useState(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/order/my-orders");
      setOrders(res.data.data || []);
    } catch (error) {
      // Fallback to customer/all-orders if needed
      try {
        const fallbackRes = await api.get("/customer/all-orders");
        setOrders(fallbackRes.data.data || []);
      } catch {
        toast.error(
          error.response?.data?.message || "Failed to fetch orders. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancellingId(orderId);
      const res = await api.patch(`/order/cancel/${orderId}`, {
        reason: "Cancelled by customer from dashboard",
      });
      toast.success(res.data?.message || "Order cancelled successfully");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: "cancelled" } : o))
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel order. Please try again."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const handleRateOrder = async (e) => {
    e.preventDefault();
    if (!ratingOrder) return;

    try {
      setIsSubmittingRating(true);
      const res = await api.patch(`/order/rate/${ratingOrder._id}`, {
        rating: selectedRating,
      });
      toast.success(res.data?.message || "Thank you for rating your order!");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === ratingOrder._id ? { ...o, rating: selectedRating } : o
        )
      );
      setRatingOrder(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit rating. Please try again."
      );
    } finally {
      setIsSubmittingRating(false);
    }
  };

  if (isLoading) {
    return <Loader height="300px" width="100%" text="Fetching your order history..." />;
  }

  const toggleExpand = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
            Order History
          </h2>
          <p className="text-xs sm:text-sm font-normal text-slate-500">
            Track live deliveries with Google Maps, view receipts, and rate past meals
          </p>
        </div>

        {orders.length > 0 && (
          <Link
            to="/track-order"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold hover:bg-orange-100 transition shadow-xs w-fit"
          >
            <IoMapOutline size={16} />
            <span>Open Live Tracker</span>
          </Link>
        )}
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const currentStep = getStepIndex(order.orderStatus);
            const statusNorm = (order.orderStatus || "").toLowerCase();
            const isFailed = ["cancelled", "failed", "rejected"].includes(statusNorm);
            const isExpanded = expandedOrderId === order._id;
            const isDelivered = statusNorm === "delivered";
            const canCancel = ["pending", "accepted"].includes(statusNorm);

            const restaurantName =
              order.restaurantId?.restaurantName || "Featured Kitchen";
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

                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap sm:flex-nowrap">
                    {/* Live Track Button */}
                    <button
                      onClick={() => setTrackingModalOrder(order)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                        !isDelivered && !isFailed
                          ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-500 hover:to-amber-500 shadow-orange-600/20"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <IoMapOutline size={14} />
                      <span>{!isDelivered && !isFailed ? "Live Track Map" : "View Route"}</span>
                    </button>

                    <div className="text-right">
                      <p className="font-heading text-base font-bold text-slate-900">
                        ₹{order.billDetails?.finalAmount || 0}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          isFailed
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : isDelivered
                            ? "bg-slate-100 text-slate-700 border border-slate-200"
                            : "bg-orange-50 text-orange-700 border border-orange-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isFailed
                              ? "bg-red-500"
                              : isDelivered
                              ? "bg-emerald-500"
                              : "bg-orange-500 animate-pulse"
                          }`}
                        />
                        {order.orderStatus || "Pending"}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Progress Stepper for Active/Recent orders */}
                {!isFailed && (
                  <div className="px-5 py-3.5 bg-slate-50/50 border-b border-slate-100">
                    <div className="flex items-center justify-between max-w-2xl mx-auto relative">
                      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
                      <div
                        className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-orange-500 transition-all duration-500 -z-0"
                        style={{
                          width: `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%`,
                        }}
                      />

                      {ORDER_STEPS.map((step, idx) => {
                        const isCompleted = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div
                            key={step.key}
                            className="flex flex-col items-center gap-1 z-10"
                          >
                            <div
                              className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-xs ${
                                isCompleted
                                  ? "bg-orange-600 text-white ring-4 ring-orange-100"
                                  : "bg-white text-slate-400 border border-slate-200"
                              } ${isCurrent && !isDelivered ? "animate-pulse" : ""}`}
                            >
                              {idx + 1}
                            </div>
                            <span
                              className={`text-[10px] font-bold ${
                                isCompleted ? "text-orange-950" : "text-slate-400"
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

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 bg-white space-y-4 border-t border-slate-100">
                    <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                      {order.orderItems?.map((item, idx) => {
                        const custom = item.customization || {};
                        const isCustom =
                          custom.isCustomized ||
                          custom.size ||
                          custom.baseOrCrust ||
                          custom.specialInstructions;

                        return (
                          <div key={idx} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="h-5 w-5 rounded-md bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-[10px]">
                                  {item.quantity || 1}x
                                </span>
                                <span className="font-bold text-slate-800">{item.itemName || "Item"}</span>
                                {isCustom && (
                                  <span className="rounded-md bg-orange-100 px-1.5 py-0.2 text-[9px] font-black text-orange-700">
                                    Customized
                                  </span>
                                )}
                              </div>
                              <span className="text-slate-900 font-bold">
                                ₹{(item.price || 0) * (item.quantity || 1)}
                              </span>
                            </div>

                            {/* Customization Details */}
                            {isCustom && (
                              <div className="ml-7 flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                                {custom.size && (
                                  <span className="bg-slate-100 px-1.5 py-0.5 rounded font-semibold text-slate-700">
                                    Size: {custom.size}
                                  </span>
                                )}
                                {custom.baseOrCrust && (
                                  <span className="bg-slate-100 px-1.5 py-0.5 rounded font-semibold text-slate-700">
                                    Base: {custom.baseOrCrust}
                                  </span>
                                )}
                                {custom.spiceLevel && (
                                  <span className="bg-orange-50 text-orange-800 px-1.5 py-0.5 rounded font-semibold">
                                    {custom.spiceLevel}
                                  </span>
                                )}
                                {custom.selectedAddOns?.map((a, i) => (
                                  <span key={i} className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                                    +{a.name}
                                  </span>
                                ))}
                                {custom.selectedSauces?.map((s, i) => (
                                  <span key={i} className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                                    +{s.name}
                                  </span>
                                ))}
                                {custom.specialInstructions && (
                                  <span className="w-full mt-0.5 text-orange-900 bg-orange-50/80 px-2 py-0.5 rounded italic">
                                    Note: "{custom.specialInstructions}"
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <p className="text-xs text-slate-500 font-medium">
                        Delivery to: <span className="text-slate-800 font-semibold">{order.deliveryAddress?.address || "Delivery Address"}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        {canCancel && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancellingId === order._id}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition shadow-xs disabled:opacity-50"
                          >
                            <IoCloseCircleOutline size={16} />
                            <span>{cancellingId === order._id ? "Cancelling..." : "Cancel Order"}</span>
                          </button>
                        )}

                        {isDelivered && (
                          <button
                            onClick={() => {
                              setRatingOrder(order);
                              setSelectedRating(order.rating || 5);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 transition shadow-xs"
                          >
                            <IoStar className="text-amber-500" size={15} />
                            <span>{order.rating ? `Rated ${order.rating}★` : "Rate Order"}</span>
                          </button>
                        )}

                        <button
                          onClick={() => setTrackingModalOrder(order)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3.5 py-2 text-xs font-bold text-orange-700 hover:bg-orange-100 transition shadow-xs"
                        >
                          <IoMapOutline size={15} />
                          <span>Google Map Tracker</span>
                        </button>

                        {restId && (
                          <Link
                            to={`/restaurant-details/${restId}`}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
                          >
                            Order Again →
                          </Link>
                        )}
                      </div>
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
            Browse our top restaurants and place your first order.
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

      {/* Live Map Tracking Modal */}
      {trackingModalOrder && (
        <OrderTrackingModal
          isOpen={!!trackingModalOrder}
          onClose={() => setTrackingModalOrder(null)}
          orderId={trackingModalOrder._id}
          initialOrderData={trackingModalOrder}
        />
      )}

      {/* Rating Modal */}
      {ratingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100">
            <div className="text-center space-y-1">
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Rate your meal
              </h3>
              <p className="text-xs text-slate-500">
                How was your experience with {ratingOrder.restaurantId?.restaurantName || "this restaurant"}?
              </p>
            </div>

            <div className="flex justify-center items-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  className="p-1 text-3xl transition hover:scale-110 focus:outline-none"
                >
                  {star <= selectedRating ? (
                    <IoStar className="text-amber-400 drop-shadow-xs" />
                  ) : (
                    <IoStarOutline className="text-slate-300" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRatingOrder(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRateOrder}
                disabled={isSubmittingRating}
                className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 text-xs font-bold text-white hover:bg-orange-500 transition shadow-sm shadow-orange-600/20 disabled:opacity-50"
              >
                {isSubmittingRating ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;