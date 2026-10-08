import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

/**
 * Auto-fits Google Map camera bounds to encompass all active coordinates
 * @param {Object} props
 * @param {Array<{lat: number, lng: number}>} props.points
 * @param {boolean} [props.autoFit=true]
 */
export const MapBoundsFitter = ({ points = [], autoFit = true }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !autoFit || !points || points.length === 0 || !window.google?.maps) return;

    try {
      const bounds = new window.google.maps.LatLngBounds();
      let validCount = 0;

      points.forEach((pt) => {
        if (pt && typeof pt.lat === "number" && typeof pt.lng === "number" && !isNaN(pt.lat) && !isNaN(pt.lng)) {
          bounds.extend({ lat: pt.lat, lng: pt.lng });
          validCount++;
        }
      });

      if (validCount > 0) {
        map.fitBounds(bounds, {
          top: 60,
          right: 60,
          bottom: 60,
          left: 60,
        });

        // Ensure zoom is reasonable if all points are very close
        const listener = window.google.maps.event.addListenerOnce(map, "idle", () => {
          if (map.getZoom() > 17) {
            map.setZoom(16);
          }
        });
        return () => window.google.maps.event.removeListener(listener);
      }
    } catch (err) {
      console.warn("MapBoundsFitter error:", err);
    }
  }, [map, points, autoFit]);

  return null;
};

export default MapBoundsFitter;
