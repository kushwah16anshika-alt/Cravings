import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  IoStorefront,
  IoHome,
  IoMapOutline,
  IoCall,
  IoKeyOutline,
  IoNavigateOutline,
  IoSpeedometerOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { MdDeliveryDining } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import DeliveryRoutePolyline from "./DeliveryRoutePolyline";
import MapBoundsFitter from "./MapBoundsFitter";
import { useGoogleMapsKey } from "./GoogleMapsWrapper";
import {
  createRestaurantIcon,
  createRiderIcon,
  createDestinationIcon,
} from "../map/LeafletIcons";
import { fetchDeliveryRoute } from "../../services/map.service";

/**
 * Custom Floating Map Controls
 */
const MapControlsOverlay = ({ onCenterRider, onFitAll, isLiveGps }) => {
  return (
    <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
      <button
        type="button"
        onClick={onCenterRider}
        title="Focus on Rider Position"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md text-slate-800 font-bold text-xs shadow-md border border-slate-200 hover:bg-orange-50 hover:text-orange-600 transition active:scale-95"
      >
        <MdDeliveryDining className="text-orange-600" size={18} />
        <span>Rider</span>
        {isLiveGps && (
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
        )}
      </button>

      <button
        type="button"
        onClick={onFitAll}
        title="View Full Delivery Route"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md text-slate-800 font-bold text-xs shadow-md border border-slate-200 hover:bg-orange-50 hover:text-orange-600 transition active:scale-95"
      >
        <IoMapOutline className="text-slate-600" size={16} />
        <span>Full Route</span>
      </button>
    </div>
  );
};

/**
 * Controller to programmatically pan/zoom Leaflet map
 */
const MapPanController = ({ centerTarget, trigger }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !centerTarget) return;
    map.setView([centerTarget.lat, centerTarget.lng], 16, { animate: true });
  }, [map, centerTarget, trigger]);

  return null;
};

/**
 * Leaflet Resize Invalidator
 */
const MapInvalidator = () => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(t);
  }, [map]);
  return null;
};

/**
 * Main Order Tracking Leaflet Map Component with OpenStreetMap & Geoapify
 */
export const OrderTrackingMap = ({
  orderId = "",
  restaurant,
  destination,
  rider,
  orderStatus = "onTheWay",
  customPolylinePath = null,
}) => {
  const { openKeySettings } = useGoogleMapsKey();

  const [centerTarget, setCenterTarget] = useState(null);
  const [panTrigger, setPanTrigger] = useState(0);
  const [fitTrigger, setFitTrigger] = useState(1);

  // Route metrics from Geoapify Routing API
  const [routeData, setRouteData] = useState(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  // Safe Restaurant Coordinates
  const restPos = useMemo(() => {
    const lat = Number(restaurant?.location?.lat);
    const lng = Number(restaurant?.location?.lng ?? restaurant?.location?.lon);
    return {
      lat: !isNaN(lat) && lat !== 0 ? lat : 12.9716,
      lng: !isNaN(lng) && lng !== 0 ? lng : 77.5946,
    };
  }, [restaurant]);

  // Safe Destination Coordinates
  const destPos = useMemo(() => {
    const lat = Number(destination?.location?.lat);
    const lng = Number(destination?.location?.lng ?? destination?.location?.lon);
    return {
      lat: !isNaN(lat) && lat !== 0 ? lat : restPos.lat + 0.0185,
      lng: !isNaN(lng) && lng !== 0 ? lng : restPos.lng + 0.0152,
    };
  }, [destination, restPos]);

  // Safe Rider Coordinates (supports real GPS or interpolated progress)
  const riderPos = useMemo(() => {
    const rawLat = Number(rider?.location?.lat);
    const rawLng = Number(rider?.location?.lng ?? rider?.location?.lon);

    if (!isNaN(rawLat) && !isNaN(rawLng) && rawLat !== 0 && rawLng !== 0) {
      return { lat: rawLat, lng: rawLng };
    }

    const prog = rider?.progress !== undefined ? rider.progress : 0.6;
    return {
      lat: restPos.lat + (destPos.lat - restPos.lat) * prog,
      lng: restPos.lng + (destPos.lng - restPos.lng) * prog,
    };
  }, [rider, restPos, destPos]);

  // Fetch Geoapify Delivery Route between restaurant and drop
  useEffect(() => {
    let isCancelled = false;

    const loadRoute = async () => {
      try {
        setIsRouteLoading(true);
        const data = await fetchDeliveryRoute(
          restPos.lat,
          restPos.lng,
          destPos.lat,
          destPos.lng,
          "motorcycle"
        );
        if (!isCancelled && data) {
          setRouteData(data);
        }
      } catch (err) {
        console.warn("Could not calculate Geoapify delivery route:", err);
      } finally {
        if (!isCancelled) setIsRouteLoading(false);
      }
    };

    if (restPos.lat && destPos.lat) {
      loadRoute();
    }

    return () => {
      isCancelled = true;
    };
  }, [restPos.lat, restPos.lng, destPos.lat, destPos.lng]);

  // Polyline positions array in [lat, lng] format
  const polylinePositions = useMemo(() => {
    if (customPolylinePath && customPolylinePath.length >= 2) {
      return customPolylinePath.map((p) => (Array.isArray(p) ? p : [p.lat, p.lng]));
    }
    if (routeData?.coordinates && routeData.coordinates.length >= 2) {
      return routeData.coordinates;
    }
    return [
      [restPos.lat, restPos.lng],
      [riderPos.lat, riderPos.lng],
      [destPos.lat, destPos.lng],
    ];
  }, [customPolylinePath, routeData, restPos, riderPos, destPos]);

  // Points for camera bounds
  const allFitPoints = useMemo(() => {
    return [
      [restPos.lat, restPos.lng],
      [riderPos.lat, riderPos.lng],
      [destPos.lat, destPos.lng],
    ];
  }, [restPos, riderPos, destPos]);

  // Actions
  const handleFocusRider = () => {
    setCenterTarget(riderPos);
    setPanTrigger((p) => p + 1);
  };

  const handleFitAll = () => {
    setFitTrigger((k) => k + 1);
  };

  const isLiveGps = !!rider?.isLiveGps;

  return (
    <div
      className="relative w-full h-full min-h-[480px] rounded-3xl overflow-hidden shadow-xl border border-slate-200"
      data-order-id={orderId}
    >
      <div className="w-full h-full min-h-[480px]">
        <MapContainer
          key={`osm-map-${orderId || "active"}`}
          center={[riderPos.lat, riderPos.lng]}
          zoom={15}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%", minHeight: "480px" }}
        >
          {/* OpenStreetMap Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors | Powered by Geoapify'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          <MapInvalidator />
          <MapPanController centerTarget={centerTarget} trigger={panTrigger} />
          <MapBoundsFitter key={`fit-${fitTrigger}`} points={allFitPoints} autoFit={true} />

          {/* Glowing Delivery Route Polyline */}
          <DeliveryRoutePolyline path={polylinePositions} color="#ea580c" />

          {/* 1. RESTAURANT MARKER */}
          <Marker
            position={[restPos.lat, restPos.lng]}
            icon={createRestaurantIcon(restaurant?.name || "Kitchen")}
          >
            <Popup>
              <div className="p-2 text-slate-800 space-y-1.5 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-base flex-shrink-0">
                    🍳
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-heading text-xs font-bold text-slate-900 truncate">
                      {restaurant?.name || "Restaurant Kitchen"}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate">
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
            </Popup>
          </Marker>

          {/* 2. LIVE RIDER MARKER (With animated radar) */}
          <Marker
            position={[riderPos.lat, riderPos.lng]}
            icon={createRiderIcon(rider?.name || "Rider", isLiveGps)}
          >
            <Popup>
              <div className="p-2 text-slate-800 space-y-2 min-w-[220px]">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-900 text-orange-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    🛵
                  </div>
                  <div>
                    <h4 className="font-heading text-xs font-bold text-slate-900">
                      {rider?.name || "Delivery Partner"}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      ⭐ {rider?.rating || "4.9"} • {rider?.vehicle || "Electric Scooter"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-orange-600 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{isLiveGps ? "Live GPS Connected" : "On the way"}</span>
                  </span>
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
            </Popup>
          </Marker>

          {/* 3. DESTINATION MARKER */}
          <Marker
            position={[destPos.lat, destPos.lng]}
            icon={createDestinationIcon(destination?.recipientName || "Your Drop")}
          >
            <Popup>
              <div className="p-2 text-slate-800 space-y-1 min-w-[200px]">
                <h4 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1">
                  <span>📍 Delivery Destination</span>
                </h4>
                <p className="text-[11px] font-medium text-slate-700">
                  {destination?.address || "Delivery Address"}
                </p>
                <p className="text-[10px] text-slate-500">
                  Recipient: {destination?.recipientName || "Customer"}
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Floating Center / Fit Map Controls */}
      <MapControlsOverlay
        onCenterRider={handleFocusRider}
        onFitAll={handleFitAll}
        isLiveGps={isLiveGps}
      />

      {/* Floating Route Telemetry Bar */}
      <div className="absolute bottom-3 left-3 right-16 z-[1000] flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-bold shadow-lg border border-slate-800">
          <div className="flex items-center gap-1 text-orange-400">
            <IoSpeedometerOutline size={14} />
            <span>{routeData?.distanceKm || "2.4 km"}</span>
          </div>

          <span className="text-slate-600">•</span>

          <div className="flex items-center gap-1 text-emerald-400">
            <IoTimeOutline size={14} />
            <span>{routeData?.durationMinutes || "12 mins travel"}</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">•</span>

          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Routing: {routeData?.provider === "geoapify" ? "Geoapify API" : "OpenStreetMap"}
          </span>
        </div>
      </div>

      {/* Configure Key / Info Button */}
      <button
        type="button"
        onClick={openKeySettings}
        className="absolute bottom-3 right-3 z-[1000] flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-slate-700 text-[11px] font-bold shadow-md border border-slate-200 hover:text-orange-600 hover:border-orange-200 transition"
        title="OpenStreetMap & Geoapify Configuration"
      >
        <IoKeyOutline size={14} className="text-orange-600" />
        <span className="hidden sm:inline">Map Config</span>
      </button>
    </div>
  );
};

export default OrderTrackingMap;
