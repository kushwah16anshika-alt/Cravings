import React, { useState, useEffect, useRef } from "react";
import {
  IoSearchOutline,
  IoLocationOutline,
  IoCloseCircleOutline,
  IoMapOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { RiLoader4Fill, RiNavigationFill } from "react-icons/ri";
import toast from "react-hot-toast";
import { searchAddress, reverseGeocodeCoords } from "../../services/map.service";
import CravingsMap from "./CravingsMap";
import { Marker, Popup } from "react-leaflet";
import { createPickerPinIcon } from "./LeafletIcons";

/**
 * Address Autocomplete and Interactive Map Location Picker
 *
 * @param {Object} props
 * @param {string} props.value - Current address string value
 * @param {Function} props.onChange - Standard change handler for text input
 * @param {Function} props.onSelectAddress - Callback when an address or pin is selected
 * @param {number|string} [props.currentLat] - Current latitude
 * @param {number|string} [props.currentLon] - Current longitude
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.showMapPicker=true] - Whether to allow interactive map pin picking
 */
export const AddressAutocomplete = ({
  value = "",
  onChange,
  onSelectAddress,
  currentLat = "",
  currentLon = "",
  placeholder = "Search street, landmark, or building address...",
  showMapPicker = true,
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showModalMap, setShowModalMap] = useState(false);

  // Selected Pin for modal map
  const [modalPin, setModalPin] = useState(() => {
    const pLat = parseFloat(currentLat);
    const pLon = parseFloat(currentLon);
    if (!isNaN(pLat) && !isNaN(pLon)) {
      return { lat: pLat, lng: pLon };
    }
    return { lat: 12.9716, lng: 77.5946 };
  });
  const [reverseAddressInfo, setReverseAddressInfo] = useState(null);
  const [isReverseLoading, setIsReverseLoading] = useState(false);

  const containerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Keep local query in sync if parent value changes externally
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    if (onChange) onChange(e);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!text || text.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    setIsOpen(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchAddress(text);
        setSuggestions(results);
      } catch (err) {
        console.warn("Autocomplete suggestion error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  const handleSelectSuggestion = (item) => {
    setQuery(item.formatted || item.addressLine1);
    setIsOpen(false);

    if (onSelectAddress) {
      onSelectAddress({
        address: item.addressLine1 || item.formatted,
        fullAddress: item.formatted,
        city: item.city || "",
        state: item.state || "",
        pinCode: item.pinCode || "",
        country: item.country || "India",
        geoLat: item.lat,
        geoLon: item.lon,
      });
    }

    toast.success("Delivery address & GPS coordinates pinned!");
  };

  // Browser Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const rev = await reverseGeocodeCoords(latitude, longitude);
          if (rev) {
            setQuery(rev.formatted || rev.addressLine1);
            if (onSelectAddress) {
              onSelectAddress({
                address: rev.addressLine1 || rev.formatted,
                fullAddress: rev.formatted,
                city: rev.city || "",
                state: rev.state || "",
                pinCode: rev.pinCode || "",
                country: rev.country || "India",
                geoLat: latitude,
                geoLon: longitude,
              });
            }
          }
          toast.success("Current GPS location retrieved!");
        } catch {
          toast.success(`Coordinates found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.warn("Geolocation permission error:", error);
        toast.error("Location permission denied or unavailable. Please enter your address manually.");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Interactive Map Pin Click
  const handleMapClick = async ({ lat, lng }) => {
    setModalPin({ lat, lng });
    setIsReverseLoading(true);
    try {
      const rev = await reverseGeocodeCoords(lat, lng);
      setReverseAddressInfo(rev);
    } catch {
      setReverseAddressInfo(null);
    } finally {
      setIsReverseLoading(false);
    }
  };

  const handleConfirmMapPin = () => {
    if (!modalPin) return;

    const chosenAddress = reverseAddressInfo?.addressLine1 || reverseAddressInfo?.formatted || `Pinned Location (${modalPin.lat.toFixed(4)}, ${modalPin.lng.toFixed(4)})`;

    setQuery(chosenAddress);
    setShowModalMap(false);

    if (onSelectAddress) {
      onSelectAddress({
        address: chosenAddress,
        fullAddress: reverseAddressInfo?.formatted || chosenAddress,
        city: reverseAddressInfo?.city || "Bengaluru",
        state: reverseAddressInfo?.state || "Karnataka",
        pinCode: reverseAddressInfo?.pinCode || "",
        country: reverseAddressInfo?.country || "India",
        geoLat: modalPin.lat,
        geoLon: modalPin.lng,
      });
    }

    toast.success("Coordinates & location confirmed on OpenStreetMap!");
  };

  const hasCoords = currentLat && currentLon && !isNaN(Number(currentLat)) && !isNaN(Number(currentLon));

  return (
    <div ref={containerRef} className="relative w-full space-y-1.5">
      {/* Input row */}
      <div className="relative flex items-center">
        <IoSearchOutline className="absolute left-3.5 text-slate-400 text-base pointer-events-none" />

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-24 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
        />

        {/* Action icons on right */}
        <div className="absolute right-2 flex items-center gap-1">
          {isSearching && (
            <RiLoader4Fill className="animate-spin text-orange-500 text-base" />
          )}

          {query && !isSearching && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                setIsOpen(false);
                if (onChange) onChange({ target: { name: "address", value: "" } });
              }}
              className="text-slate-400 hover:text-slate-600 p-1"
              title="Clear"
            >
              <IoCloseCircleOutline size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isGettingLocation}
            title="Use Current GPS Location"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 text-[10px] font-bold transition disabled:opacity-50"
          >
            {isGettingLocation ? (
              <RiLoader4Fill className="animate-spin" size={13} />
            ) : (
              <RiNavigationFill size={12} />
            )}
            <span className="hidden sm:inline">GPS</span>
          </button>

          {showMapPicker && (
            <button
              type="button"
              onClick={() => setShowModalMap(true)}
              title="Pick Delivery Location on Map"
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold transition"
            >
              <IoMapOutline size={13} />
              <span className="hidden sm:inline">Map</span>
            </button>
          )}
        </div>
      </div>

      {/* Geocoded status badge */}
      {hasCoords && (
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 w-fit">
          <IoCheckmarkCircle size={12} className="text-emerald-600 flex-shrink-0" />
          <span>
            GPS Pinned: {Number(currentLat).toFixed(4)}, {Number(currentLon).toFixed(4)}
          </span>
        </div>
      )}

      {/* Suggestion Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100 animate-fadeIn">
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Suggested Addresses (Geoapify)</span>
            <span>Select to Pin</span>
          </div>

          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSuggestion(item)}
              className="w-full p-2.5 flex items-start gap-2.5 text-left hover:bg-orange-50/70 transition group cursor-pointer"
            >
              <div className="h-6 w-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-orange-600 group-hover:text-white transition">
                <IoLocationOutline size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate group-hover:text-orange-600 transition">
                  {item.addressLine1 || item.formatted}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {[item.addressLine2, item.city, item.state, item.pinCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Interactive Map Picker Modal */}
      {showModalMap && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  📍
                </div>
                <div>
                  <h3 className="font-heading text-base font-black text-slate-900">
                    Pin Delivery Destination on Map
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Click anywhere on the OpenStreetMap to set precise delivery coordinates
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModalMap(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            {/* Interactive Leaflet Map */}
            <div className="w-full h-[340px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-200">
              <CravingsMap
                center={modalPin}
                zoom={15}
                onMapClick={handleMapClick}
                height="100%"
              >
                {modalPin && (
                  <Marker
                    position={[modalPin.lat, modalPin.lng]}
                    icon={createPickerPinIcon()}
                  >
                    <Popup>
                      <div className="p-1 text-xs">
                        <strong className="text-orange-600 block mb-0.5">Delivery Pin</strong>
                        <span>Lat: {modalPin.lat.toFixed(4)}, Lon: {modalPin.lng.toFixed(4)}</span>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </CravingsMap>
            </div>

            {/* Selected info card */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Selected Location
                </span>
                <p className="font-bold text-slate-800 truncate">
                  {isReverseLoading
                    ? "Identifying street address via Geoapify..."
                    : reverseAddressInfo?.formatted ||
                      `Coordinates: ${modalPin.lat.toFixed(5)}, ${modalPin.lng.toFixed(5)}`}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModalMap(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-white text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMapPin}
                  className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs shadow-xs transition"
                >
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
