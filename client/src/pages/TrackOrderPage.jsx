import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../config/api.config.js";
import LiveOrderTrackerWrapped from "../components/orderTracking/LiveOrderTracker";
import Loader from "../components/Loader";
import {
  IoArrowBack,
  IoMapOutline,
  IoReceiptOutline,
  IoStorefrontOutline,
} from "react-icons/io5";

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(orderId || null);
  const [isLoading, setIsLoading] = useState(!orderId);

  useEffect(() => {
    if (orderId) {
      setSelectedOrderId(orderId);
    } else {
      // Fetch user's orders and pick the most recent one
      const fetchRecentOrders = async () => {
        try {
          setIsLoading(true);
          const res = await api.get("/customer/all-orders");
          const userOrders = res.data.data || [];
          setOrders(userOrders);
          if (userOrders.length > 0) {
            setSelectedOrderId(userOrders[0]._id);
          }
        } catch (err) {
          console.warn("Could not fetch orders for tracking page:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecentOrders();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader height="300px" width="100%" text="Locating live order details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] pb-24 pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 transition"
            >
              <IoArrowBack size={20} />
            </button>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                <span>Track Your Order</span>
                <span className="rounded-full bg-orange-100 p-1 text-orange-600 text-sm">
                  <IoMapOutline />
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Real-time GPS tracking with live rider telematics and step progression
              </p>
            </div>
          </div>

          {/* Quick switcher if multiple orders exist */}
          {orders.length > 1 && (
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-slate-200 text-xs">
              <span className="text-slate-400 font-bold">Switch Order:</span>
              <select
                value={selectedOrderId || ""}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="font-bold text-slate-900 bg-transparent focus:outline-hidden"
              >
                {orders.map((o) => (
                  <option key={o._id} value={o._id}>
                    #{o._id.slice(-6).toUpperCase()} - {o.restaurantId?.restaurantName || "Kitchen"}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Live Order Tracker Console */}
        <LiveOrderTrackerWrapped orderId={selectedOrderId} />
      </div>
    </div>
  );
};

export default TrackOrderPage;
