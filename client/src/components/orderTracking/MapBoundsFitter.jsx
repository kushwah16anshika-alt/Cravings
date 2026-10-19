import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

/**
 * Auto-fits Leaflet Map camera bounds to encompass all active coordinates
 * @param {Object} props
 * @param {Array<Array<number>|{lat: number, lng: number}>} props.points
 * @param {boolean} [props.autoFit=true]
 * @param {Array<number>} [props.padding=[50, 50]]
 */
export const MapBoundsFitter = ({ points = [], autoFit = true, padding = [50, 50] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !autoFit || !points || points.length === 0) return;

    try {
      const validPoints = points
        .map((pt) => {
          if (Array.isArray(pt)) {
            const [lat, lng] = pt;
            if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)) {
              return [lat, lng];
            }
          } else if (pt && typeof pt.lat === "number") {
            const lng = pt.lng ?? pt.lon;
            if (typeof lng === "number" && !isNaN(pt.lat) && !isNaN(lng)) {
              return [pt.lat, lng];
            }
          }
          return null;
        })
        .filter(Boolean);

      if (validPoints.length === 0) return;

      if (validPoints.length === 1) {
        map.setView(validPoints[0], Math.min(map.getZoom() || 15, 16), { animate: true });
        return;
      }

      const bounds = L.latLngBounds(validPoints);
      map.fitBounds(bounds, { padding, maxZoom: 16, animate: true });
    } catch (err) {
      console.warn("MapBoundsFitter warning:", err);
    }
  }, [map, points, autoFit, padding]);

  return null;
};

export default MapBoundsFitter;
