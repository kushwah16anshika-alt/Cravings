import React, { useState } from "react";
import {
  FaRupeeSign,
  FaCheckCircle,
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";
import { IoLocationOutline, IoCheckmarkDoneCircle } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const RiderOverview = () => {
  const { user } = useAuth();
  const userName = user?.fullName || user?.fullname || "Partner";

  const [activeDelivery, setActiveDelivery] = useState({
    id: "CRV-9281",
    restaurant: "Campus Spice Kitchen",
    restaurantLocation: "Student Central Food Court, Stall #4",
    dropLocation: "CV Raman Hostel, Room 312",
    customerName: "Rohan Verma",
    customerPhone: "+91 98765 12345",
    items: "2x Paneer Tikka Roll, 1x Cold Coffee",
    amount: "₹280",
    riderEarning: "₹45",
    status: "In Transit",
    estTime: "10 mins",
  });

  const stats = [
    {
      label: "Today's Earnings",
      value: "₹850",
      change: "+18% today",
      icon: FaRupeeSign,
    },
    {
      label: "Completed Trips",
      value: "12",
      change: "100% on time",
      icon: FaCheckCircle,
    },
    {
      label: "Avg. Delivery Time",
      value: "16 mins",
      change: "Fast dispatch",
      icon: FaClock,
    },
    {
      label: "Rating",
      value: "4.9 / 5.0",
      change: "140+ reviews",
      icon: FaStar,
    },
  ];

  const recentDeliveries = [
    {
      id: "CRV-8942",
      restaurant: "Urban Pizza & Cafe",
      dropLocation: "Girls Hostel 2, Gate #1",
      customer: "Sneha Patel",
      items: "1x Farmhouse Pizza, 1x Garlic Bread",
      time: "25 mins ago",
      earning: "₹50",
      status: "Delivered",
    },
    {
      id: "CRV-8821",
      restaurant: "The Daily Chai & Snacks",
      dropLocation: "Engineering Block B, Lab 204",
      customer: "Aditya Sharma",
      items: "2x Bun Maska, 2x Special Masala Chai",
      time: "1 hour ago",
      earning: "₹35",
      status: "Delivered",
    },
    {
      id: "CRV-8750",
      restaurant: "Royal Biryani Corner",
      dropLocation: "Aryabhatta Hostel, Room 108",
      customer: "Kunal Deshmukh",
      items: "1x Hyderabadi Dum Biryani, 1x Raita",
      time: "2 hours ago",
      earning: "₹55",
      status: "Delivered",
    },
  ];

  const handleCompleteActiveDelivery = () => {
    toast.success("Delivery completed. ₹45 added to earnings.");
    setActiveDelivery(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200/80">
        <div>
          <h1 className="font-heading text-xl font-bold text-slate-900">
            Overview
          </h1>
          <p className="text-xs text-slate-500">
            Welcome back, {userName}. Here is your shift summary.
          </p>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-[11px] font-medium text-slate-500">
                  {stat.label}
                </p>
                <h3 className="font-heading text-xl font-bold text-slate-900 mt-1">
                  {stat.value}
                </h3>
                <span className="text-[10px] font-medium text-slate-400 mt-0.5 block">
                  {stat.change}
                </span>
              </div>
              <div className="h-9 w-9 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100">
                <Icon size={14} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Delivery */}
      {activeDelivery ? (
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
              <h2 className="text-sm font-bold text-slate-900">
                Current Active Delivery
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                #{activeDelivery.id}
              </span>
            </div>
            <span className="text-xs font-medium text-slate-500">
              Est. {activeDelivery.estTime}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="h-6 w-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase">
                    Pickup
                  </p>
                  <p className="text-xs font-bold text-slate-900">
                    {activeDelivery.restaurant}
                  </p>
                  <p className="text-xs text-slate-500">
                    {activeDelivery.restaurantLocation}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-6 w-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                  <IoLocationOutline />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase">
                    Drop-off
                  </p>
                  <p className="text-xs font-bold text-slate-900">
                    {activeDelivery.customerName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {activeDelivery.dropLocation}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase">
                  Items
                </p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {activeDelivery.items}
                </p>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  Payout: <span className="font-bold text-slate-900">{activeDelivery.riderEarning}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${activeDelivery.customerPhone}`}
                  className="flex-1 text-center py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Call Customer
                </a>
                <button
                  onClick={handleCompleteActiveDelivery}
                  className="flex-1 py-2 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition"
                >
                  Mark Delivered
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 text-center py-8">
          <p className="text-sm font-semibold text-slate-800">
            No active orders in transit
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Keep your app online to receive incoming pickup requests.
          </p>
        </div>
      )}

      {/* Recent Deliveries Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Recent Deliveries
          </h2>
          <span className="text-xs text-slate-400 font-medium">Today</span>
        </div>

        <div className="divide-y divide-slate-100">
          {recentDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">
                    {delivery.restaurant}
                  </span>
                  <span className="text-slate-400">#{delivery.id}</span>
                </div>
                <p className="text-slate-600">{delivery.dropLocation}</p>
                <p className="text-[11px] text-slate-400">
                  {delivery.items} • {delivery.time}
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between">
                <span className="font-bold text-slate-900">
                  +{delivery.earning}
                </span>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded mt-0.5">
                  Delivered
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiderOverview;