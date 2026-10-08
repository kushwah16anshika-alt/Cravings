import { useEffect, useRef } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

/**
 * Renders an animated glowing delivery route polyline on Google Maps
 * @param {Object} props
 * @param {Array<{lat: number, lng: number}>} props.path - Coordinates array
 * @param {string} props.color - Stroke color (default: #ea580c)
 */
export const DeliveryRoutePolyline = ({ path = [], color = "#ea580c" }) => {
  const map = useMap();
  const coreLib = useMapsLibrary("core");
  const polylineRef = useRef(null);
  const glowPolylineRef = useRef(null);

  useEffect(() => {
    if (!map || !path || path.length < 2) return;

    // Clean up previous polyline instances
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }
    if (glowPolylineRef.current) {
      glowPolylineRef.current.setMap(null);
    }

    try {
      // Glow polyline (translucent wide background line)
      glowPolylineRef.current = new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.25,
        strokeWeight: 10,
        map: map,
      });

      // Main active delivery polyline
      polylineRef.current = new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.9,
        strokeWeight: 4,
        map: map,
      });
    } catch (err) {
      console.warn("DeliveryRoutePolyline render warning:", err);
    }

    return () => {
      if (polylineRef.current) polylineRef.current.setMap(null);
      if (glowPolylineRef.current) glowPolylineRef.current.setMap(null);
    };
  }, [map, path, color, coreLib]);

  return null;
};

export default DeliveryRoutePolyline;
