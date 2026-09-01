import React, { useEffect, useState } from "react";
import {
  MdOutlineShoppingBag,
  MdOutlineAttachMoney,
  MdOutlineRestaurant,
  MdArrowForward,
} from "react-icons/md";
import { IoTimeOutline, IoSparkles } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config";
import Loader from "../Loader";

const Overview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/customer/all-orders");
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error("Overview fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled", "failed", "rejected"].includes(o.orderStatus?.toLowerCase())
  ).length;

  const totalSpent = orders
    .filter((o) => o.paymentDetails?.paymentStatus === "completed" || o.orderStatus === "delivered")
    .reduce((sum, o) => sum + (o.billDetails?.finalAmount || 0), 0);

  const userName = user?.fullName || user?.fullname || "Foodie";

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-xs">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-100/80 px-2.5 py-0.5 text-[11px] font-bold text-orange-700">
            <IoSparkles size={13} />
            <span>Welcome to Cravings</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
            Hey, {userName}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Track active meals, reorder campus favorites, and view your dining analytics.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">
              Total Orders
            </p>
            <p className="font-heading text-2xl font-extrabold text-slate-900">
              {totalOrders}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100/80">
            <MdOutlineShoppingBag size={20} />
          </div>
        </div>

        {/* Active Orders */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">
              Active Orders
            </p>
            <p className="font-heading text-2xl font-extrabold text-slate-900">
              {activeOrders}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100/80">
            <IoTimeOutline size={20} />
          </div>
        </div>

        {/* Total Spent */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">
              Total Spent
            </p>
            <p className="font-heading text-2xl font-extrabold text-slate-900">
              ₹{totalSpent.toFixed(0)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100/80">
            <MdOutlineAttachMoney size={20} />
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Recent Orders
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Your latest meals and deliveries
            </p>
          </div>
          <button
            onClick={() => navigate("/order-now")}
            className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition"
          >
            <span>Order New Dish</span>
            <MdArrowForward />
          </button>
        </div>

        {isLoading ? (
          <Loader height="150px" text="Loading recent orders..." />
        ) : orders.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order._id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100/80 flex-shrink-0">
                    <MdOutlineRestaurant size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading text-xs font-bold text-slate-900">
                      {order.restaurantId?.restaurantName || "Campus Kitchen"}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {order.orderItems?.length || 1} items • ₹{order.billDetails?.finalAmount || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      order.orderStatus === "delivered"
                        ? "bg-slate-100 text-slate-700 border border-slate-200"
                        : "bg-orange-50 text-orange-700 border border-orange-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        order.orderStatus === "delivered" ? "bg-emerald-500" : "bg-orange-500"
                      }`}
                    />
                    {order.orderStatus || "Pending"}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-slate-400 space-y-2">
            <p className="text-xs font-medium text-slate-600">No orders placed yet</p>
            <button
              onClick={() => navigate("/order-now")}
              className="mt-2 px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-xs hover:bg-orange-500 transition"
            >
              Order Your First Meal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;