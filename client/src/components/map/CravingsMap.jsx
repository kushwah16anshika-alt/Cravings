import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { DEFAULT_MAP_CENTER } from "../../services/map.service";

/**
 * Controller to auto-fit bounds to all active points
 */
const BoundsFitter = ({ points = [], padding = [45, 45], maxZoom = 16 }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    const validLatLngs = points
      .filter((p) => {
        if (!p) return false;
        const lat = Array.isArray(p) ? p[0] : p.lat;
        const lng = Array.isArray(p) ? p[1] : p.lng ?? p.lon;
        return typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng);
      })
      .map((p) => {
        const lat = Array.isArray(p) ? p[0] : p.lat;
        const lng = Array.isArray(p) ? p[1] : p.lng ?? p.lon;
        return [lat, lng];
      });

    if (validLatLngs.length === 0) return;

    if (validLatLngs.length === 1) {
      map.setView(validLatLngs[0], Math.min(map.getZoom() || 15, maxZoom), { animate: true });
      return;
    }

    try {
      const bounds = L.latLngBounds(validLatLngs);
      map.fitBounds(bounds, { padding, maxZoom, animate: true });
    } catch (e) {
      console.warn("BoundsFitter warning:", e);
    }
  }, [map, points, padding, maxZoom]);

  return null;
};

/**
 * Controller to pan map when target coordinate changes
 */
const MapCenterController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !center) return;
    const lat = Array.isArray(center) ? center[0] : center.lat;
    const lng = Array.isArray(center) ? center[1] : center.lng ?? center.lon;

    if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)) {
      map.setView([lat, lng], zoom || map.getZoom(), { animate: true });
    }
  }, [map, center, zoom]);

  return null;
};

/**
 * Fixes Leaflet tile rendering glitches when rendered in modals, tabs, or resized containers
 */
const MapResizeInvalidator = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    // Initial invalidate
    const t1 = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const t2 = setTimeout(() => {
      map.invalidateSize();
    }, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map]);

  return null;
};

/**
 * Listens to map click events for interactive location picking
 */
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick({
          lat: Number(e.latlng.lat.toFixed(6)),
          lng: Number(e.latlng.lng.toFixed(6)),
        });
      }
    },
  });
  return null;
};

/**
 * Reusable Cravings OpenStreetMap Leaflet Map Component
 *
 * @param {Object} props
 * @param {Array<number>|{lat: number, lng: number}} [props.center] - Default map center
 * @param {number} [props.zoom=14] - Default zoom level
 * @param {Array<Array<number>|{lat: number, lng: number}>} [props.fitPoints] - Points to auto-fit
 * @param {Function} [props.onMapClick] - Click handler for coordinate picking
 * @param {string} [props.height="100%"] - CSS height
 * @param {string} [props.className] - Additional classes
 * @param {React.ReactNode} [props.children] - Markers, polylines, popups
 */
export const CravingsMap = ({
  center = DEFAULT_MAP_CENTER,
  zoom = 14,
  fitPoints = null,
  onMapClick = null,
  height = "100%",
  className = "",
  children = null,
}) => {
  const mapRef = useRef(null);

  // Normalize center
  const initialCenter = Array.isArray(center)
    ? center
    : [
        typeof center?.lat === "number" ? center.lat : DEFAULT_MAP_CENTER.lat,
        typeof center?.lng === "number" ? center.lng : typeof center?.lon === "number" ? center.lon : DEFAULT_MAP_CENTER.lng,
      ];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner ${className}`}
      style={{ height, minHeight: "260px" }}
    >
      <MapContainer
        ref={mapRef}
        center={initialCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        attributionControl={true}
        style={{ width: "100%", height: "100%", minHeight: "260px" }}
      >
        {/* OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors | Powered by Geoapify'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Dynamic Controllers */}
        <MapResizeInvalidator />
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
        {center && <MapCenterController center={center} zoom={zoom} />}
        {fitPoints && fitPoints.length > 0 && <BoundsFitter points={fitPoints} />}

        {/* Map Elements (Markers, Polylines, Info Popups) */}
        {children}
      </MapContainer>
    </div>
  );
};

export default CravingsMap;
