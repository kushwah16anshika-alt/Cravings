import React, { useEffect } from "react";

const Test = () => {
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            "Geolocation:",
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.log("Geolocation error:", error.message);
        }
      );
    }
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">Diagnostics & Test Screen</h1>
        <p className="text-sm text-slate-500 mt-2">Cravings diagnostics component is running normally.</p>
      </div>
    </div>
  );
};

export default Test;