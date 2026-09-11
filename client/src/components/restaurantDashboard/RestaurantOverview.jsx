import React, { useState, useEffect, useCallback } from "react";
import {
  MdOutlineShoppingBag,
  MdOutlineCurrencyRupee,
  MdOutlineTimer,
  MdOutlineRestaurantMenu,
  MdOutlineRefresh,
  MdOutlineCheckCircle,
  MdOutlineArrowForward,
  MdOutlineAddCircleOutline,
  MdOutlineStorefront,
  MdOutlineStar,
  MdOutlineDeliveryDining,
  MdOutlineOutdoorGrill,
} from "react-icons/md";
import { IoSparkles } from "react-icons/io5";
import api from "../../config/api.config";
import toast from "react-hot-toast";

const RestaurantOverview = ({ onNavigateTab, onStatusUpdated }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStoreStatus, setUpdatingStoreStatus] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchOverviewStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/restaurant/dashboard-stats");
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch restaurant dashboard stats:", err);
      toast.error("Could not load latest overview data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverviewStats();
  }, [fetchOverviewStats]);

  const handleToggleStoreStatus = async () => {
    if (!stats?.restaurant) return;
    try {
      setUpdatingStoreStatus(true);
      const nextStatus = !stats.restaurant.isOpen;
      const res = await api.patch(`/restaurant/change-open-status/${nextStatus}`);
      toast.success(res.data?.message || `Store is now ${nextStatus ? "Open" : "Closed"}`);
      setStats((prev) => ({
        ...prev,
        restaurant: {
          ...prev.restaurant,
          isOpen: nextStatus,
        },
      }));
      sessionStorage.setItem("RestaurantOpen", nextStatus ? "true" : "false");
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      console.error("Error toggling restaurant status:", err);
      toast.error("Failed to update store availability");
    } finally {
      setUpdatingStoreStatus(false);
    }
  };

  const handleQuickAdvanceOrder = async (orderId, currentStatus) => {
    let nextStatus = "accepted";
    if (currentStatus === "pending") nextStatus = "accepted";
    else if (currentStatus === "accepted") nextStatus = "preparing";
    else if (currentStatus === "preparing") nextStatus = "ready";

    try {
      setActionLoadingId(orderId);
      const res = await api.patch(`/restaurant/order/${orderId}/status`, {
        status: nextStatus,
      });
      toast.success(res.data?.message || `Order status updated to ${nextStatus}`);
      fetchOverviewStats();
    } catch (err) {
      console.error("Failed to update order status:", err);
      toast.error(err.response?.data?.message || "Failed to update order status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: "New Order", bg: "bg-amber-100 text-amber-800 border-amber-200" },
      accepted: { label: "Accepted", bg: "bg-blue-100 text-blue-800 border-blue-200" },
      preparing: { label: "Cooking", bg: "bg-orange-100 text-orange-800 border-orange-200" },
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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black border ${s.bg}`}>
        {s.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-36 rounded-3xl bg-slate-200/80" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-3xl bg-slate-200/80" />
          ))}
        </div>
        <div className="h-72 rounded-3xl bg-slate-200/80" />
      </div>
    );
  }

  const restaurant = stats?.restaurant;
  const isOpen = restaurant?.isOpen;

  return (
    <div className="space-y-6">
      {/* Top Banner Card with Store Status Control */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white p-6 sm:p-8 shadow-xl shadow-orange-950/10">
        <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
          <MdOutlineStorefront size={220} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
              <IoSparkles />
              <span>Kitchen Partner Console</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight">
              {restaurant?.restaurantName || "My Restaurant"}
            </h1>
            <p className="text-orange-100 text-xs sm:text-sm font-medium line-clamp-2">
              {restaurant?.description ||
                "Manage your live kitchen orders, modify dish availability, and review daily restaurant sales."}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-orange-100">
              <span className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
                <MdOutlineTimer className="text-amber-300" />
                <span>Hours: {restaurant?.servingHours?.openingTime || "10:00"} - {restaurant?.servingHours?.closingTime || "23:00"}</span>
              </span>
              <span className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
                <MdOutlineStar className="text-amber-300" />
                <span>{restaurant?.averageRating || 4.8} / 5.0 Rating</span>
              </span>
            </div>
          </div>

          {/* Store Availability Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div>
              <p className="text-[11px] font-bold text-orange-200 uppercase tracking-wider">
                Store Availability
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isOpen ? "bg-emerald-400 animate-pulse" : "bg-slate-300"
                  }`}
                />
                <span className="font-heading font-black text-base">
                  {isOpen ? "Accepting Orders" : "Kitchen Paused"}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleStoreStatus}
              disabled={updatingStoreStatus}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition shadow-md ${
                isOpen
                  ? "bg-white text-orange-700 hover:bg-orange-50"
                  : "bg-emerald-500 text-white hover:bg-emerald-600"
              }`}
            >
              {updatingStoreStatus
                ? "Updating..."
                : isOpen
                ? "Pause Store"
                : "Open Store"}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Today's Revenue
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <MdOutlineCurrencyRupee size={22} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-heading text-2xl font-black text-slate-900">
              ₹{stats?.todayRevenue?.toLocaleString("en-IN") || 0}
            </h3>
            <p className="text-[11px] font-bold text-slate-400 mt-1">
              Total lifetime: ₹{stats?.totalRevenue?.toLocaleString("en-IN") || 0}
            </p>
          </div>
        </div>

        {/* Live Kitchen Queue */}
        <div
          onClick={() => onNavigateTab && onNavigateTab("orders")}
          className="cursor-pointer rounded-3xl bg-white p-5 border border-orange-200/80 shadow-xs hover:shadow-md hover:border-orange-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              Kitchen Queue
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform">
              <MdOutlineOutdoorGrill size={22} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-heading text-2xl font-black text-slate-900">
              {stats?.liveOrdersCount || 0}
            </h3>
            <p className="text-[11px] font-bold text-orange-600 mt-1 flex items-center gap-1">
              <span>View live kitchen orders</span>
              <MdOutlineArrowForward />
            </p>
          </div>
        </div>

        {/* Today's Orders */}
        <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Today's Orders
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MdOutlineShoppingBag size={22} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-heading text-2xl font-black text-slate-900">
              {stats?.todayOrders || 0}
            </h3>
            <p className="text-[11px] font-bold text-slate-400 mt-1">
              All time: {stats?.totalOrders || 0} orders
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div
          onClick={() => onNavigateTab && onNavigateTab("menu")}
          className="cursor-pointer rounded-3xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Active Dishes
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <MdOutlineRestaurantMenu size={22} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-heading text-2xl font-black text-slate-900">
              {stats?.availableMenuItems || 0} / {stats?.totalMenuItems || 0}
            </h3>
            <p className="text-[11px] font-bold text-amber-600 mt-1 flex items-center gap-1">
              <span>Manage menu items</span>
              <MdOutlineArrowForward />
            </p>
          </div>
        </div>
      </div>

      {/* Kitchen Pipeline Visualizer */}
      <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-base font-black text-slate-900">
              Kitchen Fulfillment Flow
            </h2>
            <p className="text-xs font-medium text-slate-500">
              Live operational stages from student ordering to delivery completion.
            </p>
          </div>
          <button
            onClick={fetchOverviewStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            <MdOutlineRefresh size={16} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div
            onClick={() => onNavigateTab && onNavigateTab("orders")}
            className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-center cursor-pointer hover:scale-102 transition"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
              1. New Orders
            </span>
            <p className="font-heading text-xl font-black text-amber-900 mt-1">
              {stats?.recentOrders?.filter((o) => o.orderStatus === "pending").length || 0}
            </p>
          </div>

          <div
            onClick={() => onNavigateTab && onNavigateTab("orders")}
            className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200 text-center cursor-pointer hover:scale-102 transition"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-700">
              2. In Kitchen
            </span>
            <p className="font-heading text-xl font-black text-orange-900 mt-1">
              {stats?.recentOrders?.filter((o) => ["accepted", "preparing"].includes(o.orderStatus)).length || 0}
            </p>
          </div>

          <div
            onClick={() => onNavigateTab && onNavigateTab("orders")}
            className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-center cursor-pointer hover:scale-102 transition"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">
              3. Ready for Rider
            </span>
            <p className="font-heading text-xl font-black text-blue-900 mt-1">
              {stats?.recentOrders?.filter((o) => o.orderStatus === "ready").length || 0}
            </p>
          </div>

          <div
            onClick={() => onNavigateTab && onNavigateTab("orders")}
            className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 text-center cursor-pointer hover:scale-102 transition"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
              4. With Rider
            </span>
            <p className="font-heading text-xl font-black text-purple-900 mt-1">
              {stats?.recentOrders?.filter((o) => ["pickedUp", "onTheWay", "outForDelivery"].includes(o.orderStatus)).length || 0}
            </p>
          </div>

          <div
            onClick={() => onNavigateTab && onNavigateTab("orders")}
            className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center cursor-pointer hover:scale-102 transition col-span-2 sm:col-span-1"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
              5. Completed
            </span>
            <p className="font-heading text-xl font-black text-emerald-900 mt-1">
              {stats?.completedOrdersCount || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Stream */}
      <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-base font-black text-slate-900">
              Live Recent Orders
            </h2>
            <p className="text-xs font-medium text-slate-500">
              Real-time incoming customer requests and quick preparation status updates.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab("orders")}
            className="flex items-center gap-1 text-xs font-black text-orange-600 hover:text-orange-700 hover:underline"
          >
            <span>View All Orders</span>
            <MdOutlineArrowForward />
          </button>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Dishes Ordered</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Kitchen Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {stats.recentOrders.map((order) => {
                  const orderId = order._id;
                  const shortId = `#${orderId.slice(-6).toUpperCase()}`;
                  const itemsSummary = (order.orderItems || [])
                    .map((item) => `${item.quantity}x ${item.itemName}`)
                    .join(", ");
                  const customerName = order.customerId?.fullName || "Student";
                  const amount = order.billDetails?.finalAmount || 0;

                  return (
                    <tr key={orderId} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-3 font-mono font-black text-slate-800">
                        {shortId}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs">
                            {customerName.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800 truncate max-w-[120px]">
                            {customerName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 max-w-[200px] truncate">
                        {itemsSummary || "Custom Order"}
                      </td>
                      <td className="py-3.5 px-3 font-black text-slate-900">
                        ₹{amount}
                      </td>
                      <td className="py-3.5 px-3">
                        {getStatusBadge(order.orderStatus)}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {order.orderStatus === "pending" && (
                          <button
                            onClick={() => handleQuickAdvanceOrder(orderId, "pending")}
                            disabled={actionLoadingId === orderId}
                            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-[11px] shadow-xs transition"
                          >
                            {actionLoadingId === orderId ? "..." : "Accept Order"}
                          </button>
                        )}
                        {order.orderStatus === "accepted" && (
                          <button
                            onClick={() => handleQuickAdvanceOrder(orderId, "accepted")}
                            disabled={actionLoadingId === orderId}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-[11px] shadow-xs transition"
                          >
                            {actionLoadingId === orderId ? "..." : "Start Prep"}
                          </button>
                        )}
                        {order.orderStatus === "preparing" && (
                          <button
                            onClick={() => handleQuickAdvanceOrder(orderId, "preparing")}
                            disabled={actionLoadingId === orderId}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] shadow-xs transition"
                          >
                            {actionLoadingId === orderId ? "..." : "Mark Ready"}
                          </button>
                        )}
                        {["ready", "pickedUp", "onTheWay", "outForDelivery"].includes(order.orderStatus) && (
                          <span className="text-[11px] font-bold text-indigo-600 flex items-center justify-end gap-1">
                            <MdOutlineDeliveryDining size={16} />
                            <span>Rider Assigned</span>
                          </span>
                        )}
                        {order.orderStatus === "delivered" && (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                            <MdOutlineCheckCircle size={15} />
                            <span>Completed</span>
                          </span>
                        )}
                        {["cancelled", "rejected"].includes(order.orderStatus) && (
                          <span className="text-[11px] font-bold text-slate-400">
                            Closed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 space-y-2 border border-dashed border-slate-200 rounded-2xl">
            <span className="text-3xl">🛎️</span>
            <p className="font-heading font-black text-sm text-slate-700">
              No recent orders in this session
            </p>
            <p className="text-xs text-slate-400">
              New customer orders will appear here in real-time.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigateTab && onNavigateTab("menu")}
          className="flex items-center justify-between p-4 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 transition shadow-md group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-600 text-white">
              <MdOutlineAddCircleOutline size={22} />
            </div>
            <div>
              <h4 className="font-heading font-black text-sm">Add / Edit Menu Items</h4>
              <p className="text-[11px] text-slate-400 font-medium">Update pricing, photos, and dish availability</p>
            </div>
          </div>
          <MdOutlineArrowForward className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition" size={20} />
        </button>

        <button
          onClick={() => onNavigateTab && onNavigateTab("settings")}
          className="flex items-center justify-between p-4 rounded-3xl bg-white border border-slate-200/80 text-slate-900 hover:bg-slate-50 transition shadow-xs group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <MdOutlineStorefront size={22} />
            </div>
            <div>
              <h4 className="font-heading font-black text-sm">Kitchen & Store Settings</h4>
              <p className="text-[11px] text-slate-400 font-medium">Manage operating hours, address, and legal details</p>
            </div>
          </div>
          <MdOutlineArrowForward className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition" size={20} />
        </button>
      </div>
    </div>
  );
};

export default RestaurantOverview;