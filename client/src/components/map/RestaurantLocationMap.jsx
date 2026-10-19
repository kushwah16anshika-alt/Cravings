import React, { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import CravingsMap from "./CravingsMap";
import { createRestaurantIcon } from "./LeafletIcons";
import { IoCallOutline, IoTimeOutline, IoLocationOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

/**
 * Interactive Restaurant Location Map with Leaflet and OpenStreetMap
 *
 * @param {Object} props
 * @param {Object} props.restaurant - Restaurant data object from database
 * @param {string} [props.height="280px"] - Height of map container
 * @param {boolean} [props.showCard=true] - Whether to show restaurant details below map
 */
export const RestaurantLocationMap = ({
  restaurant,
  height = "280px",
  showCard = false,
}) => {
  // Parse actual restaurant coordinates stored in DB
  const coords = useMemo(() => {
    const rawLat = parseFloat(restaurant?.geoLocation?.lat);
    const rawLon = parseFloat(restaurant?.geoLocation?.lon);

    if (!isNaN(rawLat) && !isNaN(rawLon) && rawLat !== 0 && rawLon !== 0) {
      return { lat: rawLat, lng: rawLon, isValid: true };
    }

    // Default food district coordinate if restaurant has not updated GPS yet
    return { lat: 12.9716, lng: 77.5946, isValid: false };
  }, [restaurant]);

  const name = restaurant?.restaurantName || "Restaurant Kitchen";
  const address = restaurant?.address || "University / Gourmet Avenue";
  const city = restaurant?.city || "Bengaluru";
  const phone = restaurant?.contactDetails?.phone || "";
  const rating = restaurant?.averageRating || 4.8;
  const hours = restaurant?.servingHours
    ? `${restaurant.servingHours.openingTime || "09:00"} - ${restaurant.servingHours.closingTime || "22:00"}`
    : "10:00 AM - 11:00 PM";

  return (
    <div className="w-full space-y-3">
      {/* Interactive Map */}
      <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
        <CravingsMap
          center={[coords.lat, coords.lng]}
          zoom={15}
          fitPoints={[[coords.lat, coords.lng]]}
          height="100%"
        >
          <Marker
            position={[coords.lat, coords.lng]}
            icon={createRestaurantIcon(name)}
          >
            <Popup>
              <div className="p-2 space-y-2 min-w-[210px] text-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    🍳
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-heading text-xs font-black text-slate-900 truncate">
                      {name}
                    </h4>
                    <p className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                      <FaStar size={10} /> {rating} • Open Now
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 flex items-start gap-1.5 pt-1 border-t border-slate-100">
                  <IoLocationOutline className="text-orange-600 mt-0.5 flex-shrink-0" size={14} />
                  <span>{[address, city].filter(Boolean).join(", ")}</span>
                </div>

                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-1.5 w-full justify-center px-2 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold transition shadow-xs"
                  >
                    <IoCallOutline size={12} /> Call Restaurant
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        </CravingsMap>
      </div>

      {/* Coordinate & Accuracy Notice */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
        <span className="flex items-center gap-1">
          <span className={`h-2 w-2 rounded-full ${coords.isValid ? "bg-emerald-500" : "bg-amber-500"}`} />
          <span>{coords.isValid ? "Verified Restaurant Location" : "Approximate District Area"}</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </span>
      </div>

      {/* Optional details strip */}
      {showCard && (
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900">{name}</h4>
            <span className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
              <FaStar size={11} /> {rating}
            </span>
          </div>
          <p className="text-slate-600 text-[11px]">{address}, {city}</p>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-200">
            <span className="flex items-center gap-1">
              <IoTimeOutline className="text-orange-600" /> {hours}
            </span>
            {phone && (
              <a href={`tel:${phone}`} className="text-orange-600 font-bold hover:underline">
                {phone}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantLocationMap;
