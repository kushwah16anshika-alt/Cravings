import React, { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLocationOutline, IoStorefrontOutline, IoTimeOutline } from "react-icons/io5";
import toast from "react-hot-toast";

const RiderOrders = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [orders, setOrders] = useState([
    {
      id: "CRV-9304",
      status: "new",
      restaurant: "Flavors of Punjab",
      restaurantAddress: "Canteen Hub, Block 2",
      dropAddress: "Ramanujan Hostel, Room 218",
      customerName: "Karan Johar",
      customerPhone: "+91 98765 43210",
      items: [
        { name: "Butter Chicken Rice Bowl", qty: 1 },
        { name: "Garlic Butter Naan", qty: 2 },
      ],
      orderTotal: "₹340",
      riderEarning: "₹50",
      time: "2 mins ago",
      dist: "0.8 km",
    },
    {
      id: "CRV-9281",
      status: "delivering",
      restaurant: "Campus Spice Kitchen",
      restaurantAddress: "Student Central Food Court, Stall #4",
      dropAddress: "CV Raman Hostel, Room 312",
      customerName: "Rohan Verma",
      customerPhone: "+91 98765 12345",
      items: [
        { name: "Paneer Tikka Roll", qty: 2 },
        { name: "Cold Coffee", qty: 1 },
      ],
      orderTotal: "₹280",
      riderEarning: "₹45",
      time: "12 mins ago",
      dist: "1.2 km",
    },
    {
      id: "CRV-9190",
      status: "accepted",
      restaurant: "Burger & Shake Factory",
      restaurantAddress: "North Gate Plaza",
      dropAddress: "Faculty Quarters, Flat 4B",
      customerName: "Dr. Arvind Gupta",
      customerPhone: "+91 98111 22334",
      items: [
        { name: "Crispy Veg Maharaja Burger", qty: 2 },
        { name: "Peri Peri Fries", qty: 1 },
      ],
      orderTotal: "₹450",
      riderEarning: "₹60",
      time: "18 mins ago",
      dist: "1.5 km",
    },
    {
      id: "CRV-8942",
      status: "completed",
      restaurant: "Urban Pizza & Cafe",
      restaurantAddress: "Campus Gate 1",
      dropAddress: "Girls Hostel 2, Gate #1",
      customerName: "Sneha Patel",
      customerPhone: "+91 99887 76655",
      items: [
        { name: "Farmhouse Pizza", qty: 1 },
        { name: "Garlic Bread", qty: 1 },
      ],
      orderTotal: "₹390",
      riderEarning: "₹50",
      time: "45 mins ago",
      dist: "0.9 km",
    },
  ]);

  const handleAcceptOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "accepted" } : o))
    );
    toast.success("Order accepted. Head to restaurant for pickup.");
  };

  const handlePickupOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "delivering" } : o))
    );
    toast.success("Order picked up. Head to customer drop location.");
  };

  const handleDeliverOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "completed" } : o))
    );
    toast.success("Delivery completed.");
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedFilter === "all") return true;
    return o.status === selectedFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return (
          <span className="rounded bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold">
            New Request
          </span>
        );
      case "accepted":
        return (
          <span className="rounded bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 text-[11px] font-semibold">
            Ready for Pickup
          </span>
        );
      case "delivering":
        return (
          <span className="rounded bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[11px] font-semibold">
            In Transit
          </span>
        );
      case "completed":
        return (
          <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold">
            Delivered
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80">
        <div>
          <h1 className="font-heading text-xl font-bold text-slate-900">
            Delivery Orders
          </h1>
          <p className="text-xs text-slate-500">
            Manage incoming pickup and delivery requests.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "all", label: "All" },
            { id: "new", label: "New" },
            { id: "accepted", label: "Pickup" },
            { id: "delivering", label: "In Transit" },
            { id: "completed", label: "Delivered" },
          ].map((tab) => {
            const active = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-3.5">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Order Info */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-slate-900">
                    #{order.id}
                  </span>
                  {getStatusBadge(order.status)}
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <IoTimeOutline /> {order.time}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    • {order.dist}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Pickup */}
                  <div className="flex items-start gap-2">
                    <IoStorefrontOutline className="text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {order.restaurant}
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        {order.restaurantAddress}
                      </p>
                    </div>
                  </div>

                  {/* Drop */}
                  <div className="flex items-start gap-2">
                    <IoLocationOutline className="text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {order.customerName}
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        {order.dropAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items & Payout */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                  <div className="text-slate-600">
                    {order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">Total: {order.orderTotal}</span>
                    <span className="font-bold text-slate-900">
                      Earn: {order.riderEarning}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex sm:flex-row md:flex-col gap-2 md:w-36 flex-shrink-0">
                {order.status === "new" && (
                  <button
                    onClick={() => handleAcceptOrder(order.id)}
                    className="w-full py-2 px-3 rounded-xl bg-orange-600 text-white font-semibold text-xs hover:bg-orange-700 transition"
                  >
                    Accept (+{order.riderEarning})
                  </button>
                )}

                {order.status === "accepted" && (
                  <>
                    <button
                      onClick={() => handlePickupOrder(order.id)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
                    >
                      Confirm Pickup
                    </button>
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="w-full py-1.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-50 transition text-center flex items-center justify-center gap-1"
                    >
                      <FaPhoneAlt size={10} /> Call
                    </a>
                  </>
                )}

                {order.status === "delivering" && (
                  <>
                    <button
                      onClick={() => handleDeliverOrder(order.id)}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition"
                    >
                      Mark Delivered
                    </button>
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="w-full py-1.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-50 transition text-center flex items-center justify-center gap-1"
                    >
                      <FaPhoneAlt size={10} /> Call
                    </a>
                  </>
                )}

                {order.status === "completed" && (
                  <span className="text-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 py-1.5 px-2 rounded-xl">
                    Delivered
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center py-10">
          <p className="text-sm font-semibold text-slate-800">
            No orders found
          </p>
          <p className="text-xs text-slate-500 mt-1">
            There are no orders matching this filter right now.
          </p>
        </div>
      )}
    </div>
  );
};

export default RiderOrders;