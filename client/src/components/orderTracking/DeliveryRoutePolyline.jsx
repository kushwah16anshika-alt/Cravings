import React from "react";
import { Polyline } from "react-leaflet";

/**
 * Renders an animated glowing delivery route polyline on Leaflet OpenStreetMap
 * @param {Object} props
 * @param {Array<Array<number>>} props.path - Coordinates array in [lat, lon] format
 * @param {string} [props.color="#ea580c"] - Stroke color
 */
export const DeliveryRoutePolyline = ({ path = [], color = "#ea580c" }) => {
  if (!path || path.length < 2) return null;

  // Ensure all points are [lat, lng] arrays
  const formattedPositions = path
    .map((pt) => {
      if (Array.isArray(pt)) return pt;
      if (pt && typeof pt.lat === "number") {
        return [pt.lat, pt.lng ?? pt.lon];
      }
      return null;
    })
    .filter(Boolean);

  if (formattedPositions.length < 2) return null;

  return (
    <>
      {/* Outer translucent glow line */}
      <Polyline
        positions={formattedPositions}
        pathOptions={{
          color,
          weight: 10,
          opacity: 0.25,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      {/* Main crisp polyline */}
      <Polyline
        positions={formattedPositions}
        pathOptions={{
          color,
          weight: 4,
          opacity: 0.95,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
    </>
  );
};

export default DeliveryRoutePolyline;
