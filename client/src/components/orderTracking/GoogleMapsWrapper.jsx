import React, { createContext, useContext, useState, useEffect } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { IoKeyOutline, IoCheckmarkCircle, IoInformationCircleOutline } from "react-icons/io5";

const GoogleMapsKeyContext = createContext({
  apiKey: "",
  setApiKey: () => {},
  hasCustomKey: false,
});

export const useGoogleMapsKey = () => useContext(GoogleMapsKeyContext);

export const GoogleMapsWrapper = ({ children }) => {
  const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem("cravings_gmaps_api_key") || envKey;
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  useEffect(() => {
    if (!apiKey && envKey) {
      setApiKey(envKey);
    }
  }, [envKey]);

  const handleSaveKey = (e) => {
    e.preventDefault();
    const clean = tempKey.trim();
    setApiKey(clean);
    if (clean) {
      localStorage.setItem("cravings_gmaps_api_key", clean);
    } else {
      localStorage.removeItem("cravings_gmaps_api_key");
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
    <GoogleMapsKeyContext.Provider value={contextValue}>
      {apiKey ? (
        <APIProvider
          apiKey={apiKey}
          libraries={["places", "geometry", "routes", "marker"]}
        >
          {children}
        </APIProvider>
      ) : (
        <>{children}</>
      )}

      {/* API Key Config Modal for developer/evaluator */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="h-10 w-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <IoKeyOutline size={22} />
              </div>
              <div>
                <h3 className="font-heading text-lg font-black text-slate-900">
                  Google Maps API Configuration
                </h3>
                <p className="text-xs text-slate-500">
                  Configure your Google Maps Platform API key
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Google Maps API Key
                </label>
                <input
                  type="text"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-mono focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-600 space-y-2">
                <p className="flex items-start gap-1.5 text-slate-700 font-semibold">
                  <IoInformationCircleOutline className="text-orange-600 flex-shrink-0 mt-0.5" size={16} />
                  <span>Prototyping with Maps Demo Key:</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Get a free, instant Maps Demo Key with zero Cloud project configuration by visiting:
                </p>
                <a
                  href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-orange-600 font-bold hover:underline text-[11px]"
                >
                  Generate Free Maps Demo Key →
                </a>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
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
    </GoogleMapsKeyContext.Provider>
  );
};

export default GoogleMapsWrapper;
