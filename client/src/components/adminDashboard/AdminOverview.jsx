import React, { useEffect, useState, useCallback } from "react";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import Loader from "../Loader";
import {
  MdOutlineAttachMoney,
  MdOutlineFastfood,
  MdOutlineStorefront,
  MdOutlinePeopleAlt,
  MdOutlineTrendingUp,
  MdRefresh,
  MdArrowForward,
} from "react-icons/md";
import { IoSparkles } from "react-icons/io5";

const statusBadge = (status) => {
  switch (status) {
    case "delivered":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "preparing":
    case "accepted":
    case "ready":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "outForDelivery":
    case "onTheWay":
    case "pickedUp":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "cancelled":
    case "failed":
    case "rejected":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const AdminOverview = ({ onNavigateTab }) => {
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/admin/stats");
      if (res.data?.success) {
        setStatsData(res.data.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load admin overview data"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading) {
    return (
      <Loader
        height="400px"
        width="100%"
        text="Calculating real-time campus statistics..."
      />
    );
  }

  const summary = statsData?.summary || {};
  const recentOrders = statsData?.recentOrders || [];

  return (
    <div className="space-y-8">
      {/* Top Banner with Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-orange-600/15 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <IoSparkles />
            <span>Campus Food Operations</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight">
            Platform Command Cockpit
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 max-w-xl font-medium">
            Monitor real-time food orders, campus kitchen revenue, active student accounts, and delivery partner status.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="relative z-10 flex items-center justify-center gap-2 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 px-5 py-3 text-xs font-black uppercase tracking-wider transition active:scale-95 text-white"
        >
          <MdRefresh size={18} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total GMV / Revenue */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs hover:border-orange-200 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Total GMV (Volume)
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <MdOutlineAttachMoney size={22} />
            </div>
          </div>
          <div>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
              ₹{(summary.totalRevenue || 0).toLocaleString()}
            </h3>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <MdOutlineTrendingUp />
              <span>Platform fees: ₹{(summary.totalPlatformFee || 0).toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs hover:border-orange-200 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Total Platform Orders
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <MdOutlineFastfood size={22} />
            </div>
          </div>
          <div>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
              {summary.totalOrders || 0}
            </h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-1">
              <span className="text-emerald-600">✓ {summary.deliveredOrders || 0} delivered</span>
              <span>•</span>
              <span className="text-amber-600">{summary.preparingOrders || 0} active</span>
            </div>
          </div>
        </div>

        {/* Active Campus Kitchens */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs hover:border-orange-200 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Campus Eateries
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <MdOutlineStorefront size={22} />
            </div>
          </div>
          <div>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
              {summary.totalRestaurants || 0}
            </h3>
            <p className="text-xs font-bold text-slate-500 mt-1">
              <span className="text-emerald-600 font-extrabold">
                {summary.activeRestaurants || 0} Kitchens
              </span>{" "}
              currently open & accepting orders
            </p>
          </div>
        </div>

        {/* Registered Users */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs hover:border-orange-200 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Platform Community
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <MdOutlinePeopleAlt size={22} />
            </div>
          </div>
          <div>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
              {summary.totalUsers || 0}
            </h3>
            <p className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-2">
              <span>{summary.customerCount || 0} Students</span>
              <span>•</span>
              <span>{summary.riderCount || 0} Riders</span>
            </p>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown Pipeline */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-black text-slate-900">
              Live Order Fulfillment Pipeline
            </h3>
            <p className="text-xs text-slate-400 font-bold">
              Real-time progression of orders across all campus food kitchens
            </p>
          </div>
          <button
            onClick={() => onNavigateTab?.("orders")}
            className="flex items-center gap-1 text-xs font-extrabold text-orange-600 hover:text-orange-700 hover:underline"
          >
            <span>View All Orders</span>
            <MdArrowForward />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
            <span className="text-xs font-bold text-slate-500">Pending</span>
            <p className="font-heading text-xl font-black text-slate-800">
              {summary.pendingOrders || 0}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center space-y-1">
            <span className="text-xs font-bold text-amber-700">In Kitchen</span>
            <p className="font-heading text-xl font-black text-amber-800">
              {summary.preparingOrders || 0}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center space-y-1">
            <span className="text-xs font-bold text-blue-700">On The Way</span>
            <p className="font-heading text-xl font-black text-blue-800">
              {summary.onTheWayOrders || 0}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-1">
            <span className="text-xs font-bold text-emerald-700">Delivered</span>
            <p className="font-heading text-xl font-black text-emerald-800">
              {summary.deliveredOrders || 0}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-center space-y-1 col-span-2 sm:col-span-1">
            <span className="text-xs font-bold text-red-700">Cancelled/Failed</span>
            <p className="font-heading text-xl font-black text-red-800">
              {summary.cancelledOrders || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-black text-slate-900">
              Recent Campus Orders
            </h3>
            <p className="text-xs text-slate-400 font-bold">
              Latest transactions processed through Cravings
            </p>
          </div>
          <button
            onClick={() => onNavigateTab?.("orders")}
            className="flex items-center gap-1 text-xs font-extrabold text-orange-600 hover:text-orange-700"
          >
            <span>Manage Orders</span>
            <MdArrowForward />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <span className="text-4xl">📦</span>
            <p className="text-sm font-bold text-slate-700">No orders placed yet</p>
            <p className="text-xs text-slate-400">
              When students start ordering food, live records will stream here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Kitchen</th>
                  <th className="pb-3">Dishes</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 font-mono text-[11px] font-bold text-slate-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-slate-900">
                        {order.customerName}
                      </div>
                      {order.customerPhone && (
                        <div className="text-[10px] text-slate-400">
                          {order.customerPhone}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 font-bold text-slate-800">
                      {order.restaurantName}
                    </td>
                    <td className="py-3.5">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-700">
                        {order.itemsCount} {order.itemsCount === 1 ? "dish" : "dishes"}
                      </span>
                    </td>
                    <td className="py-3.5 font-heading text-sm font-black text-slate-900">
                      ₹{order.finalAmount}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          order.paymentStatus === "completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase border ${statusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-[11px] text-slate-400">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;