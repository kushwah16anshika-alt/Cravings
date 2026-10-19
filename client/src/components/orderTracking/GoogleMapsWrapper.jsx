import React, { createContext, useContext, useState, useEffect } from "react";
import { IoKeyOutline, IoInformationCircleOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

const MapKeyContext = createContext({
  apiKey: "",
  setApiKey: () => {},
  hasCustomKey: false,
  openKeySettings: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useGoogleMapsKey = () => useContext(MapKeyContext);
// eslint-disable-next-line react-refresh/only-export-components
export const useMapKey = () => useContext(MapKeyContext);

/**
 * Geoapify & OpenStreetMap Configuration Wrapper
 * Replaces the obsolete Google Maps Wrapper with a zero-cost, open mapping layer.
 */
export const GoogleMapsWrapper = ({ children }) => {
  const envKey = import.meta.env.VITE_GEOAPIFY_API_KEY || "";
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem("cravings_geoapify_key") || envKey;
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  useEffect(() => {
    if (!apiKey && envKey) {
      setApiKey(envKey);
    }
  }, [envKey, apiKey]);

  const handleSaveKey = (e) => {
    e.preventDefault();
    const clean = tempKey.trim();
    setApiKey(clean);
    if (clean) {
      localStorage.setItem("cravings_geoapify_key", clean);
    } else {
      localStorage.removeItem("cravings_geoapify_key");
    }
    setShowKeyModal(false);
  };

  const contextValue = {
    apiKey,
    setApiKey,
    hasCustomKey: !!apiKey,
    openKeySettings: () => {
      setTempKey(apiKey);
      setShowKeyModal(true);
    },
  };

  return (
    <MapKeyContext.Provider value={contextValue}>
      {children}

      {/* Geoapify API Key Config Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="h-10 w-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <IoKeyOutline size={22} />
              </div>
              <div>
                <h3 className="font-heading text-lg font-black text-slate-900">
                  OpenStreetMap & Geoapify Config
                </h3>
                <p className="text-xs text-slate-500">
                  OpenStreetMap tiles are active by default. Optional Geoapify key for routing & geocoding.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Geoapify API Key (Optional)
                </label>
                <input
                  type="text"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="e.g. 4a8b... (leave blank to use backend proxy)"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-mono focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              <div className="rounded-2xl bg-emerald-50/80 p-3.5 border border-emerald-200/80 text-xs text-emerald-900 space-y-2">
                <p className="flex items-start gap-1.5 font-bold">
                  <IoCheckmarkCircleOutline className="text-emerald-600 flex-shrink-0 mt-0.5" size={16} />
                  <span>Free-Tier Friendly & Always Accessible:</span>
                </p>
                <p className="text-[11px] text-emerald-800">
                  Cravings now uses <strong>OpenStreetMap</strong> and <strong>Geoapify</strong>. Map tiles display freely without any API key. Get a free Geoapify key (3,000 requests/day, no credit card required) at:
                </p>
                <a
                  href="https://www.geoapify.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-orange-600 font-bold hover:underline text-[11px]"
                >
                  Visit Geoapify.com (Free Tier) →
                </a>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white hover:bg-orange-500 transition shadow-xs shadow-orange-600/30"
                >
                  Save Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MapKeyContext.Provider>
  );
};

export default GoogleMapsWrapper;
