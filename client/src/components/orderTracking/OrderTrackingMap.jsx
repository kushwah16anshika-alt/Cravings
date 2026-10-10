import React, { useState, useMemo, useEffect } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  IoStorefront,
  IoHome,
  IoMapOutline,
  IoCall,
  IoKeyOutline,
} from "react-icons/io5";
import { MdDeliveryDining } from "react-icons/md";
import DeliveryRoutePolyline from "./DeliveryRoutePolyline";
import MapBoundsFitter from "./MapBoundsFitter";
import { useGoogleMapsKey } from "./GoogleMapsWrapper";

/**
 * Custom Center Control Button Component inside Google Map
 */
const MapControlsOverlay = ({ onCenterRider, onFitAll }) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <button
        onClick={onCenterRider}
        title="Focus on Rider"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md text-slate-800 font-bold text-xs shadow-md border border-slate-200 hover:bg-orange-50 hover:text-orange-600 transition active:scale-95"
      >
        <MdDeliveryDining className="text-orange-600" size={18} />
        <span>Rider</span>
      </button>

      <button
        onClick={onFitAll}
        title="View Entire Delivery Route"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md text-slate-800 font-bold text-xs shadow-md border border-slate-200 hover:bg-orange-50 hover:text-orange-600 transition active:scale-95"
      >
        <IoMapOutline className="text-slate-600" size={16} />
        <span>Full Route</span>
      </button>
    </div>
  );
};

/**
 * Controller to programmatically pan/zoom map
 */
const MapPanController = ({ centerTarget, trigger }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !centerTarget) return;
    map.panTo(centerTarget);
    map.setZoom(16);
  }, [map, centerTarget, trigger]);
  return null;
};

/**
 * Interactive Radar / Simulation Canvas Map Fallback
 * Displayed when Google Maps API Key is not configured yet or when in offline testing mode
 */
const InteractiveRadarMap = ({
  restaurant,
  destination,
  rider,
  orderStatus,
  onOpenKeySettings,
}) => {
  const progress = rider?.progress !== undefined ? rider.progress : 0.5;

  return (
    <div className="relative w-full h-full min-h-[460px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center select-none shadow-2xl">
      {/* Background Radar Grid & City Lines */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />

      {/* Pulsing Concentric Radar Rings around active rider */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-orange-500/20 animate-pulse-subtle pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-orange-500/30 pointer-events-none" />

      {/* SVG Path Route Visualizer */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Glow Path */}
        <path
          d="M 120 320 Q 280 180, 520 220 T 780 140"
          fill="none"
          stroke="#ea580c"
          strokeWidth="10"
          strokeOpacity="0.2"
          className="hidden sm:block"
        />
        {/* Main dashed animated path */}
        <path
          d="M 120 320 Q 280 180, 520 220 T 780 140"
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="4"
          strokeDasharray="8 6"
          filter="url(#glow)"
          className="hidden sm:block"
        />

        {/* Mobile Path */}
        <path
          d="M 60 360 Q 180 240, 300 120"
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="4"
          strokeDasharray="6 4"
          className="block sm:hidden"
        />
      </svg>

      {/* Top Banner Notice */}
      <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-auto z-20 flex items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-orange-500/30 text-xs shadow-lg">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
          </span>
          <span className="font-bold text-slate-200">
            Live Order Simulation Radar Active
          </span>
        </div>

        <button
          onClick={onOpenKeySettings}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-400 hover:text-orange-300 transition bg-orange-500/10 px-2.5 py-1 rounded-xl border border-orange-500/30"
        >
          <IoKeyOutline size={13} />
          <span>Connect Google Maps Key</span>
        </button>
      </div>

      {/* Visual Interactive Nodes */}
      <div className="relative w-full max-w-2xl px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-8 z-10">
        {/* 1. Restaurant Node */}
        <div className="flex flex-col items-center text-center group">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 border-2 border-white/20">
              <IoStorefront size={28} />
            </div>
            <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
              ✓
            </span>
          </div>
          <p className="font-heading text-sm font-black text-white mt-2">
            {restaurant?.name || "Kitchen Hub"}
          </p>
          <span className="text-[11px] text-orange-300 font-medium">
            {restaurant?.address || "Pickup Location"}
          </span>
        </div>

        {/* 2. Live Moving Rider Node */}
        <div className="flex flex-col items-center text-center animate-float">
          <div className="relative">
            {/* Pulsing Beacon Rings */}
            <div className="absolute inset-0 rounded-full bg-orange-500 opacity-40 animate-radar" />
            <div className="h-20 w-20 rounded-full bg-slate-900 text-orange-400 flex items-center justify-center shadow-2xl border-2 border-orange-500 relative z-10">
              <MdDeliveryDining size={42} className="animate-pulse-subtle" />
            </div>
            <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
              Live
            </span>
          </div>
          <p className="font-heading text-sm font-black text-orange-400 mt-2">
            {rider?.name || "Delivery Partner"}
          </p>
          <span className="text-[11px] text-slate-300 font-semibold">
            {orderStatus === "delivered"
              ? "Delivered Successfully"
              : orderStatus === "outForDelivery" || orderStatus === "onTheWay"
              ? "Speed: 34 km/h • 8 mins away"
              : "Order Picked Up"}
          </span>
        </div>

        {/* 3. Customer Drop Location */}
        <div className="flex flex-col items-center text-center group">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-white/20">
              <IoHome size={26} />
            </div>
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-black">
              📍
            </span>
          </div>
          <p className="font-heading text-sm font-black text-white mt-2">
            {destination?.recipientName || "Delivery Drop"}
          </p>
          <span className="text-[11px] text-emerald-300 font-medium max-w-[160px] truncate">
            {destination?.address || "Customer Location"}
          </span>
        </div>
      </div>

      {/* Bottom Live Telemetry Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="text-orange-400 font-bold">Vehicle:</span>
          <span className="font-semibold text-white">{rider?.vehicle || "Hero Electric • KA-01-EA-4521"}</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400 font-bold">Progress:</span>
          <span className="text-slate-300 font-semibold">{Math.round(progress * 100)}%</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-bold">GPS Accuracy:</span>
          <span className="text-slate-300 font-semibold">± 3 meters</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Powered by Google Maps Platform SDK</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Order Tracking Google Map Component
 * Complies strictly with @vis.gl/react-google-maps patterns and Google Maps Platform Skill requirements.
 */
export const OrderTrackingMap = ({
  orderId = "",
  restaurant,
  destination,
  rider,
  orderStatus = "onTheWay",
  customPolylinePath = null,
}) => {
  const { apiKey, openKeySettings } = useGoogleMapsKey();

  const [activeMarker, setActiveMarker] = useState(null); // "restaurant" | "rider" | "destination"
  const [centerTarget, setCenterTarget] = useState(null);
  const [panTrigger, setPanTrigger] = useState(0);
  const [autoFitKey, setAutoFitKey] = useState(1);

  // Safe Default coordinates
  const restPos = useMemo(() => {
    return {
      lat: Number(restaurant?.location?.lat) || 12.9716,
      lng: Number(restaurant?.location?.lng) || 77.5946,
    };
  }, [restaurant]);

  const destPos = useMemo(() => {
    return {
      lat: Number(destination?.location?.lat) || restPos.lat + 0.0185,
      lng: Number(destination?.location?.lng) || restPos.lng + 0.0152,
    };
  }, [destination, restPos]);

  const riderPos = useMemo(() => {
    if (rider?.location?.lat && rider?.location?.lng) {
      return {
        lat: Number(rider.location.lat),
        lng: Number(rider.location.lng),
      };
    }
    // Interpolate along route
    const prog = rider?.progress !== undefined ? rider.progress : 0.6;
    return {
      lat: restPos.lat + (destPos.lat - restPos.lat) * prog,
      lng: restPos.lng + (destPos.lng - restPos.lng) * prog,
    };
  }, [rider, restPos, destPos]);

  // Points for camera bounds
  const allPoints = useMemo(() => {
    return [restPos, riderPos, destPos];
  }, [restPos, riderPos, destPos]);

  // Polyline route
  const polylinePath = useMemo(() => {
    if (customPolylinePath && customPolylinePath.length >= 2) {
      return customPolylinePath;
    }
    return [restPos, riderPos, destPos];
  }, [customPolylinePath, restPos, riderPos, destPos]);

  // Center on rider
  const handleFocusRider = () => {
    setCenterTarget(riderPos);
    setPanTrigger((p) => p + 1);
    setActiveMarker("rider");
  };

  // Center on entire route
  const handleFitAll = () => {
    setAutoFitKey((k) => k + 1);
  };

  // If no Google Maps API Key is provided, render the interactive radar simulation
  if (!apiKey) {
    return (
      <InteractiveRadarMap
        restaurant={restaurant}
        destination={destination}
        rider={rider}
        orderStatus={orderStatus}
        onOpenKeySettings={openKeySettings}
      />
    );
  }

  return (
    <div
      className="relative w-full h-full min-h-[480px] rounded-3xl overflow-hidden shadow-xl border border-slate-200"
      data-order-id={orderId}
    >
      {/* Explicit Height Container to prevent CF2 Map Height Collapse */}
      <div className="w-full h-full min-h-[480px]">
        <Map
          key={`gmap-${autoFitKey}`}
          defaultCenter={riderPos}
          defaultZoom={15}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={["gmp_git_agentskills_v1"]}
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: "100%", height: "100%", minHeight: "480px" }}
        >
          {/* Pan Controller & Bounds Fitter */}
          <MapPanController centerTarget={centerTarget} trigger={panTrigger} />
          <MapBoundsFitter points={allPoints} autoFit={true} />

          {/* Glowing Delivery Route Polyline */}
          <DeliveryRoutePolyline path={polylinePath} color="#ea580c" />

          {/* 1. RESTAURANT ADVANCED MARKER */}
          <AdvancedMarker
            position={restPos}
            title={restaurant?.name || "Kitchen"}
            onClick={() => setActiveMarker("restaurant")}
          >
            <div className="relative flex flex-col items-center group cursor-pointer">
              <div className="h-10 w-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/40 border-2 border-white transition-transform duration-200 group-hover:scale-110">
                <IoStorefront size={20} />
              </div>
              <div className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-black whitespace-nowrap shadow-sm">
                🍳 {restaurant?.name || "Kitchen"}
              </div>
            </div>
          </AdvancedMarker>

          {/* 2. RIDER ADVANCED MARKER (Animated & Pulsing) */}
          <AdvancedMarker
            position={riderPos}
            title={rider?.name || "Delivery Partner"}
            onClick={() => setActiveMarker("rider")}
          >
            <div className="relative flex flex-col items-center group cursor-pointer">
              {/* Radar pulse ring */}
              <div className="absolute top-0 left-0 w-12 h-12 -translate-x-1 -translate-y-1 rounded-full bg-orange-500/40 animate-radar pointer-events-none" />
              
              <div className="relative z-10 h-11 w-11 rounded-full bg-slate-900 text-orange-400 flex items-center justify-center shadow-xl border-2 border-orange-500 transition-transform duration-200 group-hover:scale-110">
                <MdDeliveryDining size={24} className="animate-pulse-subtle" />
              </div>

              <div className="mt-1 px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black whitespace-nowrap shadow-md flex items-center gap-1">
                <span>🛵 {rider?.name?.split(" ")[0] || "Rider"}</span>
              </div>
            </div>
          </AdvancedMarker>

          {/* 3. DESTINATION ADVANCED MARKER */}
          <AdvancedMarker
            position={destPos}
            title={destination?.recipientName || "Delivery Location"}
            onClick={() => setActiveMarker("destination")}
          >
            <div className="relative flex flex-col items-center group cursor-pointer">
              <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 border-2 border-white transition-transform duration-200 group-hover:scale-110">
                <IoHome size={19} />
              </div>
              <div className="mt-1 px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-200 text-[10px] font-black whitespace-nowrap shadow-sm">
                📍 {destination?.recipientName || "Your Drop"}
              </div>
            </div>
          </AdvancedMarker>

          {/* 4. INFO WINDOW FOR RESTAURANT */}
          {activeMarker === "restaurant" && (
            <InfoWindow
              position={restPos}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="p-2 text-slate-800 space-y-1.5 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    🍳
                  </div>
                  <div>
                    <h4 className="font-heading text-xs font-bold text-slate-900">
                      {restaurant?.name || "Restaurant"}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      {restaurant?.address || "Kitchen location"}
                    </p>
                  </div>
                </div>
                {restaurant?.phone && (
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:underline pt-1"
                  >
                    <IoCall size={12} /> Call Restaurant ({restaurant.phone})
                  </a>
                )}
              </div>
            </InfoWindow>
          )}

          {/* 5. INFO WINDOW FOR RIDER */}
          {activeMarker === "rider" && (
            <InfoWindow
              position={riderPos}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="p-2 text-slate-800 space-y-2 min-w-[220px]">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-900 text-orange-400 flex items-center justify-center text-sm font-bold">
                    🛵
                  </div>
                  <div>
                    <h4 className="font-heading text-xs font-bold text-slate-900">
                      {rider?.name || "Rahul Sharma"}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      ⭐ {rider?.rating || "4.9"} • {rider?.vehicle || "Honda Activa"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-orange-600">On the way</span>
                </div>
                {rider?.phone && (
                  <a
                    href={`tel:${rider.phone}`}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500 transition"
                  >
                    <IoCall size={12} /> Call Delivery Partner
                  </a>
                )}
              </div>
            </InfoWindow>
          )}

          {/* 6. INFO WINDOW FOR DESTINATION */}
          {activeMarker === "destination" && (
            <InfoWindow
              position={destPos}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="p-2 text-slate-800 space-y-1 min-w-[200px]">
                <h4 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1">
                  <span>📍 Delivery Address</span>
                </h4>
                <p className="text-[11px] font-medium text-slate-700">
                  {destination?.address || "Address"}
                </p>
                <p className="text-[10px] text-slate-500">
                  Recipient: {destination?.recipientName || "Customer"}
                </p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>

      {/* Floating Map Controls */}
      <MapControlsOverlay
        onCenterRider={handleFocusRider}
        onFitAll={handleFitAll}
        riderName={rider?.name}
      />

      {/* Configure Key Button */}
      <button
        onClick={openKeySettings}
        className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-600 text-[11px] font-bold shadow-md border border-slate-200 hover:text-orange-600 transition"
      >
        <IoKeyOutline size={14} />
        <span>Maps Config</span>
      </button>
    </div>
  );
};

export default OrderTrackingMap;
