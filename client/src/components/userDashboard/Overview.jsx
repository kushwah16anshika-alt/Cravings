import React, { useEffect, useState } from "react";
import {
  MdOutlineShoppingBag,
  MdOutlineAttachMoney,
  MdOutlineRestaurant,
  MdArrowForward,
} from "react-icons/md";
import { IoFlame, IoSparkles, IoTimeOutline } from "react-icons/io5";
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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-6 sm:p-8 text-white shadow-xl shadow-orange-600/20 overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-0.5 rounded-full backdrop-blur-md">
            <IoSparkles />
            <span>Welcome to your Food Hub</span>
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-black">
            Hey, {userName}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 max-w-md font-medium">
            Track active meals, reorder campus favorites, and view your dining analytics.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Orders */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Orders
            </p>
            <p className="font-heading text-3xl font-black text-slate-900">
              {totalOrders}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <MdOutlineShoppingBag size={24} />
          </div>
        </div>

        {/* Active Orders */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Orders
            </p>
            <p className="font-heading text-3xl font-black text-emerald-600">
              {activeOrders}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <IoTimeOutline size={24} />
          </div>
        </div>

        {/* Total Spent */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Spent
            </p>
            <p className="font-heading text-3xl font-black text-orange-600">
              ₹{totalSpent.toFixed(0)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <MdOutlineAttachMoney size={24} />
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-black text-slate-900">
              Recent Campus Orders
            </h3>
            <p className="text-xs font-semibold text-slate-400">
              Your latest meals & deliveries
            </p>
          </div>
          <button
            onClick={() => navigate("/order-now")}
            className="flex items-center gap-1 text-xs font-black text-orange-600 hover:underline"
          >
            <span>Order New Dish</span>
            <MdArrowForward />
          </button>
        </div>

        {isLoading ? (
          <Loader height="150px" text="Loading recent culinary orders..." />
        ) : orders.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order._id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 flex-shrink-0">
                    <MdOutlineRestaurant size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-extrabold text-slate-900">
                      {order.restaurantId?.restaurantName || "Campus Kitchen"}
                    </h4>
                    <p className="text-xs font-semibold text-slate-400">
                      {order.orderItems?.length || 1} items • ₹{order.billDetails?.finalAmount || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.orderStatus === "delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {order.orderStatus || "Pending"}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-slate-400 space-y-2">
            <span className="text-3xl">🍽️</span>
            <p className="text-xs font-bold text-slate-600">No orders placed yet</p>
            <button
              onClick={() => navigate("/order-now")}
              className="mt-2 px-4 py-2 rounded-xl bg-orange-600 text-white font-black text-xs shadow-xs hover:bg-orange-500 transition"
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