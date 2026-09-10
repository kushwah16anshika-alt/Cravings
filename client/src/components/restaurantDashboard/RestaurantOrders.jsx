import React, { useState, useEffect, useCallback } from "react";
import {
  MdOutlineSearch,
  MdOutlineRefresh,
  MdOutlineAccessTime,
  MdOutlineLocationOn,
  MdOutlinePhone,
  MdOutlinePerson,
  MdOutlineTwoWheeler,
  MdOutlineClose,
  MdOutlineCheckCircle,
  MdOutlineOutdoorGrill,
  MdOutlineFastfood,
} from "react-icons/md";
import { IoSparkles } from "react-icons/io5";
import api from "../../config/api.config";
import toast from "react-hot-toast";

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/restaurant/orders", {
        params: {
          status: activeStatusFilter === "all" ? undefined : activeStatusFilter,
          search: searchTerm.trim() || undefined,
        },
      });

      if (res.data?.success) {
        setOrders(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch restaurant orders:", err);
      toast.error(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [activeStatusFilter, searchTerm]);

  // Initial fetch and on filter/search change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Optional auto-refresh every 12 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      fetchOrders();
    }, 12000);
    return () => clearInterval(timer);
  }, [autoRefresh, fetchOrders]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setActionLoadingId(orderId);
      const res = await api.patch(`/restaurant/order/${orderId}/status`, {
        status: newStatus,
      });

      toast.success(res.data?.message || `Order status updated to ${newStatus}`);
      
      // Update local state smoothly
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.data : o))
      );

      if (selectedOrder?._id === orderId) {
        setSelectedOrder(res.data.data);
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error(err.response?.data?.message || "Failed to update order status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: "New Order", bg: "bg-amber-100 text-amber-800 border-amber-200" },
      accepted: { label: "Accepted", bg: "bg-blue-100 text-blue-800 border-blue-200" },
      preparing: { label: "Cooking / Prep", bg: "bg-orange-100 text-orange-800 border-orange-200" },
      ready: { label: "Ready for Rider", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" },
      pickedUp: { label: "Picked Up", bg: "bg-indigo-100 text-indigo-800 border-indigo-200" },
      onTheWay: { label: "On The Way", bg: "bg-purple-100 text-purple-800 border-purple-200" },
      outForDelivery: { label: "Dispatched", bg: "bg-purple-100 text-purple-800 border-purple-200" },
      delivered: { label: "Delivered", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" },
      cancelled: { label: "Cancelled", bg: "bg-rose-100 text-rose-800 border-rose-200" },
      rejected: { label: "Rejected", bg: "bg-rose-100 text-rose-800 border-rose-200" },
    };
    const s = map[status] || { label: status, bg: "bg-slate-100 text-slate-800 border-slate-200" };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black border ${s.bg}`}>
        {s.label}
      </span>
    );
  };

  const statusFilterTabs = [
    { label: "All Orders", value: "all" },
    { label: "🟡 New (Pending)", value: "pending" },
    { label: "🟠 In Kitchen (Prep)", value: "preparing" },
    { label: "🟢 Ready for Rider", value: "ready" },
    { label: "🚀 Out for Delivery", value: "outForDelivery" },
    { label: "✅ Delivered", value: "delivered" },
    { label: "❌ Cancelled", value: "cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-0.5 text-xs font-black text-orange-700 mb-1">
            <IoSparkles />
            <span>Kitchen Dispatch Station</span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900">
            Live Kitchen Orders
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Monitor incoming student tickets, accept preparation jobs, and mark food ready for riders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-orange-600 rounded cursor-pointer"
            />
            <span>Auto-Refresh (12s)</span>
          </label>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-600/20 transition"
          >
            <MdOutlineRefresh size={16} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Tabs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MdOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, Phone, or Dish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-orange-500 shadow-xs"
            />
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statusFilterTabs.map((tab) => {
            const active = activeStatusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveStatusFilter(tab.value)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-2xl text-xs font-extrabold transition ${
                  active
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Grid / Cards */}
      {loading && orders.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 rounded-3xl bg-slate-200/80" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => {
            const orderId = order._id;
            const shortId = `#${orderId.slice(-6).toUpperCase()}`;
            const customer = order.customerId;
            const rider = order.riderId;
            const items = order.orderItems || [];
            const bill = order.billDetails || {};
            const isActionLoading = actionLoadingId === orderId;

            return (
              <div
                key={orderId}
                className="flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-orange-200 transition space-y-4"
              >
                <div>
                  {/* Top Bar: Order ID, Time, and Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-slate-900">
                          {shortId}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {order.paymentDetails?.paymentMethod?.toUpperCase() || "ONLINE"}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                        <MdOutlineAccessTime size={13} />
                        <span>{new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                      </span>
                    </div>

                    <div>{getStatusBadge(order.orderStatus)}</div>
                  </div>

                  {/* Customer Details */}
                  <div className="flex items-center gap-3 pt-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 font-black text-xs flex-shrink-0">
                      {customer?.fullName?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-xs font-black text-slate-800 truncate">
                        {customer?.fullName || "Campus Student"}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 truncate flex items-center gap-1">
                        <MdOutlineLocationOn size={13} className="text-orange-600 flex-shrink-0" />
                        <span>{order.deliveryAddress?.address || "Campus Hostel / Dept"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Item List */}
                  <div className="mt-3 rounded-2xl bg-slate-50/80 p-3 space-y-1.5 border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Kitchen Items ({items.reduce((acc, it) => acc + (it.quantity || 1), 0)})
                    </p>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span className="truncate">
                            <span className="text-orange-600 font-black mr-1">{it.quantity}x</span>
                            {it.itemName}
                          </span>
                          <span className="text-slate-500 font-medium">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Amount and Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Bill</span>
                    <p className="font-heading text-lg font-black text-slate-900">
                      ₹{bill.finalAmount || 0}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition"
                    >
                      Details
                    </button>

                    {order.orderStatus === "pending" && (
                      <>
                        <button
                          onClick={() => handleUpdateOrderStatus(orderId, "rejected")}
                          disabled={isActionLoading}
                          className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-extrabold text-xs transition"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(orderId, "accepted")}
                          disabled={isActionLoading}
                          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-600/20 transition"
                        >
                          {isActionLoading ? "..." : "Accept"}
                        </button>
                      </>
                    )}

                    {order.orderStatus === "accepted" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(orderId, "preparing")}
                        disabled={isActionLoading}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-600/20 transition flex items-center gap-1"
                      >
                        <MdOutlineOutdoorGrill />
                        <span>{isActionLoading ? "..." : "Start Cooking"}</span>
                      </button>
                    )}

                    {order.orderStatus === "preparing" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(orderId, "ready")}
                        disabled={isActionLoading}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1"
                      >
                        <MdOutlineCheckCircle />
                        <span>{isActionLoading ? "..." : "Food Ready"}</span>
                      </button>
                    )}

                    {["ready", "pickedUp", "onTheWay", "outForDelivery"].includes(order.orderStatus) && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
                        <MdOutlineTwoWheeler size={16} />
                        <span>{rider?.fullName ? `Rider: ${rider.fullName}` : "Awaiting Rider"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-12 border border-slate-200/80 text-center space-y-3 shadow-xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 mx-auto text-3xl">
            <MdOutlineFastfood />
          </div>
          <h3 className="font-heading text-lg font-black text-slate-900">
            No orders found matching your criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? `No orders matching "${searchTerm}". Try resetting your search filters.`
              : `There are currently no orders under "${activeStatusFilter}". New orders will show up automatically.`}
          </p>
          {(searchTerm || activeStatusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveStatusFilter("all");
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Order Details Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-black text-slate-900">
                    Order #{selectedOrder._id.slice(-6).toUpperCase()}
                  </span>
                  {getStatusBadge(selectedOrder.orderStatus)}
                </div>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                <MdOutlineClose size={20} />
              </button>
            </div>

            {/* Customer & Delivery Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <MdOutlinePerson size={14} className="text-orange-600" />
                  <span>Customer Details</span>
                </p>
                <p className="font-heading font-black text-sm text-slate-800">
                  {selectedOrder.customerId?.fullName || "Campus Student"}
                </p>
                <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <MdOutlinePhone size={13} />
                  <span>{selectedOrder.customerId?.phone || "No phone provided"}</span>
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {selectedOrder.customerId?.email || "student@campus.edu"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <MdOutlineLocationOn size={14} className="text-orange-600" />
                  <span>Delivery Address</span>
                </p>
                <p className="font-heading font-black text-xs text-slate-800">
                  {selectedOrder.deliveryAddress?.name || selectedOrder.customerId?.fullName}
                </p>
                <p className="text-xs font-medium text-slate-600">
                  {selectedOrder.deliveryAddress?.address}, {selectedOrder.deliveryAddress?.city} - {selectedOrder.deliveryAddress?.pinCode}
                </p>
              </div>
            </div>

            {/* Rider Information (If assigned) */}
            {selectedOrder.riderId && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-sm">
                    <MdOutlineTwoWheeler size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
                      Assigned Campus Rider
                    </p>
                    <p className="font-heading font-black text-sm text-indigo-950">
                      {selectedOrder.riderId.fullName}
                    </p>
                    <p className="text-xs font-bold text-indigo-700">
                      Phone: {selectedOrder.riderId.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Itemized Order Breakdown */}
            <div className="space-y-3">
              <h3 className="font-heading font-black text-sm text-slate-900">
                Itemized Dishes
              </h3>
              <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {(selectedOrder.orderItems || []).map((it, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-black text-slate-800">
                        <span className="text-orange-600 mr-2">{it.quantity}x</span>
                        {it.itemName}
                      </p>
                      <p className="text-slate-400 text-[11px]">Unit Price: ₹{it.price}</p>
                    </div>
                    <span className="font-black text-slate-900">
                      ₹{it.price * it.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between font-medium text-slate-600">
                <span>Items Subtotal</span>
                <span>₹{selectedOrder.billDetails?.totalAmount || 0}</span>
              </div>
              <div className="flex justify-between font-medium text-slate-600">
                <span>Taxes & GST</span>
                <span>₹{selectedOrder.billDetails?.taxAmount || 0}</span>
              </div>
              <div className="flex justify-between font-medium text-slate-600">
                <span>Platform & Packaging</span>
                <span>₹{(selectedOrder.billDetails?.platformFee || 0) + (selectedOrder.billDetails?.convenienceFee || 0)}</span>
              </div>
              {selectedOrder.billDetails?.discountAmount > 0 && (
                <div className="flex justify-between font-bold text-emerald-600">
                  <span>Student Discount</span>
                  <span>-₹{selectedOrder.billDetails.discountAmount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between font-heading font-black text-base text-slate-900">
                <span>Total Amount</span>
                <span className="text-orange-600">₹{selectedOrder.billDetails?.finalAmount || 0}</span>
              </div>
            </div>

            {/* Modal Quick Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              {selectedOrder.orderStatus === "pending" && (
                <>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder._id, "rejected")}
                    className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-extrabold text-xs transition"
                  >
                    Reject Order
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder._id, "accepted")}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md transition"
                  >
                    Accept Order
                  </button>
                </>
              )}

              {selectedOrder.orderStatus === "accepted" && (
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder._id, "preparing")}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition"
                >
                  Start Preparing Food
                </button>
              )}

              {selectedOrder.orderStatus === "preparing" && (
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder._id, "ready")}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition"
                >
                  Mark Food Ready for Rider
                </button>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;