import React, { useState, useEffect, useRef } from "react";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import OrderTrackingMap from "./OrderTrackingMap";
import GoogleMapsWrapper, { useGoogleMapsKey } from "./GoogleMapsWrapper";
import {
  IoStorefrontOutline,
  IoHomeOutline,
  IoCallOutline,
  IoChatbubbleEllipsesOutline,
  IoTimeOutline,
  IoShieldCheckmarkOutline,
  IoRefreshOutline,
  IoPlayOutline,
  IoPauseOutline,
  IoChevronDown,
  IoChevronUp,
  IoReceiptOutline,
  IoCheckmarkCircle,
  IoSparkles,
  IoKeyOutline,
} from "react-icons/io5";
import { MdDeliveryDining, MdOutlineRestaurantMenu, MdFastfood } from "react-icons/md";
import { FaMotorcycle, FaStar } from "react-icons/fa";

const TRACKING_STEPS = [
  { id: "pending", label: "Order Placed", desc: "Sent to kitchen", icon: "📝" },
  { id: "accepted", label: "Confirmed", desc: "Accepted by kitchen", icon: "👨‍🍳" },
  { id: "preparing", label: "Cooking", desc: "Fresh ingredients cooking", icon: "🍳" },
  { id: "onTheWay", label: "On The Way", desc: "Rider is delivering", icon: "🛵" },
  { id: "delivered", label: "Delivered", desc: "Enjoy your meal!", icon: "🎉" },
];

const getStepNumber = (status) => {
  const norm = (status || "").toLowerCase();
  if (norm === "delivered") return 4;
  if (norm === "outfordelivery" || norm === "ontheway" || norm === "pickedup") return 3;
  if (norm === "preparing" || norm === "ready") return 2;
  if (norm === "accepted") return 1;
  return 0;
};

export const LiveOrderTracker = ({
  orderId,
  initialOrderData = null,
  onClose = null,
}) => {
  const [order, setOrder] = useState(initialOrderData);
  const [isLoading, setIsLoading] = useState(!initialOrderData && !!orderId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showItemsDrawer, setShowItemsDrawer] = useState(false);
  
  // Live Simulation state
  const [simulatedStatus, setSimulatedStatus] = useState(null);
  const [simulatedProgress, setSimulatedProgress] = useState(null);
  const [isSimulatingLiveRide, setIsSimulatingLiveRide] = useState(false);
  const simIntervalRef = useRef(null);

  const fetchTrackingData = async (silent = false) => {
    if (!orderId && !initialOrderData) return;
    try {
      if (!silent) setIsRefreshing(true);
      const res = await api.get(`/order/track/${orderId}`);
      if (res.data?.data) {
        setOrder(res.data.data);
      }
    } catch (err) {
      console.warn("Could not fetch server tracking data:", err);
      // If endpoint fails or local demo object is provided, fallback gracefully
      if (!order && initialOrderData) {
        setOrder(initialOrderData);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchTrackingData(false);
    }
  }, [orderId]);

  // Handle Live Ride Simulation along route
  useEffect(() => {
    if (isSimulatingLiveRide) {
      setSimulatedStatus("onTheWay");
      simIntervalRef.current = setInterval(() => {
        setSimulatedProgress((prev) => {
          const current = prev !== null ? prev : 0.1;
          const next = current + 0.05;
          if (next >= 1.0) {
            clearInterval(simIntervalRef.current);
            setIsSimulatingLiveRide(false);
            setSimulatedStatus("delivered");
            toast.success("🎉 Order delivered successfully!");
            return 1.0;
          }
          return next;
        });
      }, 1000);
    } else {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    }

    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, [isSimulatingLiveRide]);

  // Current effective status & progress
  const effectiveStatus = simulatedStatus || order?.orderStatus || "onTheWay";
  const stepIdx = getStepNumber(effectiveStatus);

  // Normalized order object data
  const restaurantName = order?.restaurant?.name || order?.restaurantId?.restaurantName || "Bella Napoli Pizzeria";
  const restaurantAddress = order?.restaurant?.address || order?.restaurantId?.address || "Gourmet Galleria, University Ave";
  const restaurantPhone = order?.restaurant?.phone || order?.restaurantId?.contactDetails?.phone || "+91 98765 43201";
  
  const destName = order?.destination?.recipientName || order?.deliveryAddress?.name || "Customer";
  const destAddress = order?.destination?.address || order?.deliveryAddress?.address || "Main Campus Hostel, Block 4";
  
  const riderName = order?.rider?.name || "Vikram Patel";
  const riderPhone = order?.rider?.phone || "+91 98450 99881";
  const riderVehicle = order?.rider?.vehicle || "Ather 450X (KA-01-EA-4521)";
  const riderRating = order?.rider?.rating || 4.9;

  // Real or simulated locations
  const restLocation = order?.restaurant?.location || { lat: 12.9716, lng: 77.5946 };
  const destLocation = order?.destination?.location || { lat: 12.9901, lng: 77.6098 };

  // Calculate rider position
  const effProgress = simulatedProgress !== null 
    ? simulatedProgress 
    : (order?.rider?.progress !== undefined ? order.rider.progress : (stepIdx === 4 ? 1.0 : stepIdx >= 3 ? 0.65 : 0.1));

  const effRiderLocation = {
    lat: restLocation.lat + (destLocation.lat - restLocation.lat) * effProgress,
    lng: restLocation.lng + (destLocation.lng - restLocation.lng) * effProgress,
  };

  const currentRiderObj = {
    name: riderName,
    phone: riderPhone,
    vehicle: riderVehicle,
    rating: riderRating,
    progress: effProgress,
    location: effRiderLocation,
  };

  // ETA Calculation
  const etaMins = effectiveStatus === "delivered" 
    ? 0 
    : effectiveStatus === "pending" 
    ? 30 
    : effectiveStatus === "accepted" 
    ? 25 
    : effectiveStatus === "preparing" 
    ? 18 
    : Math.max(2, Math.round(15 * (1 - effProgress)));

  const handleStepStatus = (statusKey) => {
    setIsSimulatingLiveRide(false);
    setSimulatedStatus(statusKey);
    const sIdx = getStepNumber(statusKey);
    if (sIdx === 0) setSimulatedProgress(0.0);
    else if (sIdx === 1) setSimulatedProgress(0.05);
    else if (sIdx === 2) setSimulatedProgress(0.15);
    else if (sIdx === 3) setSimulatedProgress(0.65);
    else if (sIdx === 4) setSimulatedProgress(1.0);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">
      {/* Top Banner / Order Summary Header */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-600/30 flex-shrink-0">
            <MdDeliveryDining size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-heading text-lg sm:text-xl font-black text-slate-900">
                Live Delivery Tracking
              </h2>
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-orange-700">
                Order #{orderId ? orderId.slice(-6).toUpperCase() : "CRV892"}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              From <strong className="text-slate-800">{restaurantName}</strong> to <strong className="text-slate-800">{destName}</strong>
            </p>
          </div>
        </div>

        {/* ETA Highlight Badge */}
        <div className="flex items-center justify-between sm:justify-end gap-3 bg-orange-50/80 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-orange-100">
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
              Estimated Arrival
            </span>
            <p className="font-heading text-xl sm:text-2xl font-black text-slate-900">
              {effectiveStatus === "delivered" ? "Delivered 🎉" : `${etaMins} mins`}
            </p>
          </div>

          <button
            onClick={() => fetchTrackingData(false)}
            disabled={isRefreshing}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-orange-600 hover:border-orange-200 transition shadow-xs active:scale-95 disabled:opacity-50"
            title="Refresh Live Status"
          >
            <IoRefreshOutline size={20} className={isRefreshing ? "animate-spin text-orange-600" : ""} />
          </button>
        </div>
      </div>

      {/* Visual Stepper Timeline */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-heading text-xs font-black uppercase tracking-wider text-slate-400">
            Order Lifecycle Progress
          </span>
          <span className="text-xs font-extrabold text-orange-600 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{TRACKING_STEPS[stepIdx]?.label || "Processing"}</span>
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 relative">
          {TRACKING_STEPS.map((step, idx) => {
            const isDone = idx <= stepIdx;
            const isCurrent = idx === stepIdx;

            return (
              <button
                key={step.id}
                onClick={() => handleStepStatus(step.id)}
                className="flex flex-col items-center text-center group cursor-pointer"
                title={`Click to simulate: ${step.label}`}
              >
                <div
                  className={`h-10 w-10 sm:h-11 sm:w-11 rounded-2xl flex items-center justify-center text-base sm:text-lg transition-all duration-300 ${
                    isDone
                      ? "bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/25 scale-105"
                      : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                  } ${isCurrent ? "ring-4 ring-orange-500/20" : ""}`}
                >
                  {isDone && idx < stepIdx ? "✓" : step.icon}
                </div>
                <span
                  className={`text-[11px] sm:text-xs mt-2 font-bold line-clamp-1 ${
                    isDone ? "text-slate-900 font-extrabold" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[9px] text-slate-400 font-medium hidden sm:block">
                  {step.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Google Map & Live Simulation, Right Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Google Maps Container */}
        <div className="lg:col-span-8 space-y-3">
          <div className="w-full h-[480px] sm:h-[520px]">
            <OrderTrackingMap
              orderId={orderId}
              restaurant={{
                name: restaurantName,
                address: restaurantAddress,
                phone: restaurantPhone,
                location: restLocation,
              }}
              destination={{
                recipientName: destName,
                address: destAddress,
                location: destLocation,
              }}
              rider={currentRiderObj}
              orderStatus={effectiveStatus}
            />
          </div>

          {/* Interactive Simulation & Test Bar */}
          <div className="rounded-2xl bg-slate-900 text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
              </span>
              <div>
                <p className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>Interactive Live Delivery Simulation</span>
                  <span className="bg-orange-500/20 text-orange-400 text-[9px] px-1.5 py-0.2 rounded border border-orange-500/40">DEMO</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  Test moving vehicle coordinates along the real-time Google Maps route
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsSimulatingLiveRide(!isSimulatingLiveRide)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                  isSimulatingLiveRide
                    ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                    : "bg-orange-600 text-white hover:bg-orange-500 shadow-orange-600/30"
                }`}
              >
                {isSimulatingLiveRide ? (
                  <>
                    <IoPauseOutline size={16} />
                    <span>Pause Ride</span>
                  </>
                ) : (
                  <>
                    <IoPlayOutline size={16} />
                    <span>{effProgress >= 1.0 ? "Replay Live Ride" : "Play Live Ride"}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  const nextIdx = (stepIdx + 1) % TRACKING_STEPS.length;
                  handleStepStatus(TRACKING_STEPS[nextIdx].id);
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-bold transition border border-slate-700"
              >
                Step Next ➔
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Driver & Kitchen Contact Cards */}
        <div className="lg:col-span-4 space-y-4">
          {/* Driver Card */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MdDeliveryDining className="text-orange-600 text-base" />
                <span>Delivery Partner</span>
              </h3>
              <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-100">
                <IoShieldCheckmarkOutline /> Verified Rider
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center text-xl font-black shadow-md flex-shrink-0">
                {riderName.charAt(0)}
                <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px] text-white font-black">
                  ✓
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-heading text-sm font-black text-slate-900 truncate">
                  {riderName}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <FaStar size={11} /> {riderRating}
                  </span>
                  <span>•</span>
                  <span className="truncate">{riderVehicle}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${riderPhone}`}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3 py-2.5 text-xs font-extrabold text-white hover:bg-orange-500 transition shadow-xs shadow-orange-600/30"
              >
                <IoCallOutline size={16} />
                <span>Call Rider</span>
              </a>
              <button
                onClick={() => toast.success(`Rider message sent: "Customer is waiting at ${destAddress}"`)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition"
              >
                <IoChatbubbleEllipsesOutline size={16} className="text-slate-500" />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Restaurant Card */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <IoStorefrontOutline className="text-orange-600 text-base" />
                <span>Kitchen Details</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400">Order Origin</span>
            </div>

            <div>
              <h4 className="font-heading text-sm font-black text-slate-900">
                {restaurantName}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {restaurantAddress}
              </p>
            </div>

            <a
              href={`tel:${restaurantPhone}`}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition text-center"
            >
              <IoCallOutline size={14} className="text-orange-600" />
              <span>Contact Kitchen ({restaurantPhone})</span>
            </a>
          </div>

          {/* Drop Location Card */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-2">
            <h3 className="font-heading text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <IoHomeOutline className="text-emerald-600 text-base" />
              <span>Delivery Destination</span>
            </h3>
            <p className="text-xs font-extrabold text-slate-900">{destName}</p>
            <p className="text-xs text-slate-600">{destAddress}</p>
          </div>

          {/* Order Items Drawer Accordion */}
          {order?.orderItems?.length > 0 && (
            <div className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
              <button
                onClick={() => setShowItemsDrawer(!showItemsDrawer)}
                className="w-full p-4 flex items-center justify-between text-xs font-black text-slate-800 hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-2">
                  <IoReceiptOutline className="text-orange-600" size={16} />
                  <span>Order Items & Receipt ({order.orderItems.length})</span>
                </span>
                {showItemsDrawer ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
              </button>

              {showItemsDrawer && (
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 space-y-3 text-xs">
                  <div className="divide-y divide-slate-200/60">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between">
                        <span className="text-slate-700 font-medium">
                          {item.quantity}x {item.itemName}
                        </span>
                        <span className="font-bold text-slate-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.billDetails && (
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900">
                      <span>Total Paid</span>
                      <span className="text-orange-600">₹{order.billDetails.finalAmount}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const LiveOrderTrackerWrapped = (props) => {
  return (
    <GoogleMapsWrapper>
      <LiveOrderTracker {...props} />
    </GoogleMapsWrapper>
  );
};

export default LiveOrderTrackerWrapped;
