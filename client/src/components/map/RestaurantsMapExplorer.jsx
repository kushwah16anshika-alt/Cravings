import React, { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import CravingsMap from "./CravingsMap";
import { createRestaurantIcon } from "./LeafletIcons";
import { IoLocationOutline, IoStorefrontOutline } from "react-icons/io5";

/**
 * Interactive OpenStreetMap Explorer for browsing and selecting restaurants
 *
 * @param {Object} props
 * @param {Array<Object>} props.restaurants - List of restaurant objects
 * @param {string} [props.height="520px"] - Container height
 */
export const RestaurantsMapExplorer = ({
  restaurants = [],
  height = "520px",
}) => {
  const navigate = useNavigate();

  // Parse valid coordinates from restaurants array
  const restaurantMarkers = useMemo(() => {
    return restaurants
      .map((r) => {
        const rawLat = parseFloat(r.geoLocation?.lat);
        const rawLon = parseFloat(r.geoLocation?.lon);

        let lat = rawLat;
        let lng = rawLon;

        // If coordinates missing in mock/custom data, fallback gracefully around center
        if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
          const charCode = (r.restaurantName || "A").charCodeAt(0);
          lat = 12.9716 + ((charCode % 10) - 5) * 0.008;
          lng = 77.5946 + ((charCode % 7) - 3) * 0.008;
        }

        return {
          id: r._id || r.id,
          _id: r._id || r.id,
          name: r.restaurantName,
          address: r.address || "City Center",
          city: r.city || "Bengaluru",
          rating: r.averageRating || 4.5,
          phone: r.contactDetails?.phone || "",
          coverImage: r.coverImage?.url || r.restaurantImage?.[0]?.url || "",
          isOpen: r.isOpen !== undefined ? r.isOpen : true,
          cuisineTypes: r.cuisineTypes || [],
          lat,
          lng,
        };
      })
      .filter(Boolean);
  }, [restaurants]);

  const fitPoints = useMemo(() => {
    return restaurantMarkers.map((m) => [m.lat, m.lng]);
  }, [restaurantMarkers]);

  const defaultCenter = useMemo(() => {
    if (restaurantMarkers.length > 0) {
      return [restaurantMarkers[0].lat, restaurantMarkers[0].lng];
    }
    return [12.9716, 77.5946];
  }, [restaurantMarkers]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md space-y-2">
      <div className="w-full" style={{ height, minHeight: "420px" }}>
        <CravingsMap
          center={defaultCenter}
          zoom={13}
          fitPoints={fitPoints.length > 0 ? fitPoints : null}
          height="100%"
        >
          {restaurantMarkers.map((r) => (
            <Marker
              key={r.id}
              position={[r.lat, r.lng]}
              icon={createRestaurantIcon(r.name)}
            >
              <Popup>
                <div className="p-2 space-y-2 min-w-[220px] max-w-[260px] text-slate-800">
                  {r.coverImage && (
                    <div className="relative h-24 w-full rounded-xl overflow-hidden bg-slate-100 mb-2 border border-slate-100">
                      <img
                        src={r.coverImage}
                        alt={r.name}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-black">
                        ⭐ {r.rating}
                      </span>
                    </div>
                  )}

                  <div>
                    <h4 className="font-heading text-xs font-black text-slate-900 truncate">
                      {r.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <IoLocationOutline className="text-orange-600 flex-shrink-0" />
                      <span>{[r.address, r.city].filter(Boolean).join(", ")}</span>
                    </p>
                  </div>

                  {r.cuisineTypes?.length > 0 && (
                    <div className="flex flex-wrap gap-1 text-[9px]">
                      {r.cuisineTypes.slice(0, 3).map((c, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.2 rounded bg-orange-50 text-orange-700 font-bold border border-orange-100"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate(`/restaurant-details/${r._id || r.id}`)}
                    className="w-full mt-2 flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black transition shadow-xs shadow-orange-600/30"
                  >
                    <IoStorefrontOutline size={14} />
                    <span>View Menu & Order →</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </CravingsMap>
      </div>

      {/* Floating Info Pill */}
      <div className="absolute top-3 left-3 z-[1000] px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-slate-800 font-extrabold text-xs shadow-md border border-slate-200 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{restaurantMarkers.length} Partner Kitchens on OpenStreetMap</span>
      </div>
    </div>
  );
};

export default RestaurantsMapExplorer;
