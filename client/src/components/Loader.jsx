import React from "react";
import runningLoaderGif from "../assets/runningLoader.gif";

const Loader = ({ height = "auto", width = "100%", text = "Loading delicious food...", className = "" }) => {
  return (
    <div
      style={{ minHeight: height, width }}
      className={`flex flex-col items-center justify-center p-6 transition-all duration-300 ${className}`}
    >
      <div className="relative flex flex-col items-center justify-center">
        <img
          src={runningLoaderGif}
          alt="Loading..."
          className="w-28 h-28 object-contain animate-pulse-subtle"
        />
        {text && (
          <p className="mt-3 text-sm font-semibold tracking-wide text-(--color-base-content)/70 animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loader;
