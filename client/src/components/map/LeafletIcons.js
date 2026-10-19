import L from "leaflet";

// Fix Leaflet's default marker icons in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/**
 * Creates a custom HTML DivIcon for a Restaurant location
 * @param {string} name - Restaurant Name
 */
export const createRestaurantIcon = (name = "Kitchen") => {
  const shortName = name.length > 18 ? name.slice(0, 16) + "..." : name;

  return L.divIcon({
    className: "cravings-restaurant-marker",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
        <div style="
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: linear-gradient(135deg, #ea580c, #f59e0b);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px -3px rgba(234, 88, 12, 0.45);
          border: 2.5px solid #ffffff;
          font-size: 20px;
        ">
          🍳
        </div>
        <div style="
          margin-top: 4px;
          padding: 2px 8px;
          border-radius: 6px;
          background: rgba(15, 23, 42, 0.92);
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          letter-spacing: -0.01em;
        ">
          ${shortName}
        </div>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [0, 0],
    popupAnchor: [0, -46],
  });
};

/**
 * Creates a custom HTML DivIcon for the Rider with an animated radar pulse
 * @param {string} name - Rider name
 * @param {boolean} isLive - Whether live GPS is active
 */
export const createRiderIcon = (name = "Rider", isLive = false) => {
  const shortName = name.split(" ")[0] || "Rider";

  return L.divIcon({
    className: "cravings-rider-marker",
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
        <!-- Pulsing radar ring -->
        <div class="animate-radar" style="
          position: absolute;
          top: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 46px;
          height: 46px;
          border-radius: 9999px;
          background: rgba(234, 88, 12, 0.35);
          pointer-events: none;
        "></div>

        <!-- Rider circular avatar -->
        <div style="
          position: relative;
          z-index: 10;
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          background: #0f172a;
          color: #fb923c;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 24px -4px rgba(15, 23, 42, 0.5), 0 0 0 3px #ea580c;
          font-size: 22px;
        ">
          🛵
        </div>

        <!-- Name badge -->
        <div style="
          position: relative;
          z-index: 10;
          margin-top: 4px;
          padding: 2px 8px;
          border-radius: 9999px;
          background: #ea580c;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 4px 8px rgba(234, 88, 12, 0.4);
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 9999px; background: ${
            isLive ? "#4ade80" : "#fef08a"
          };"></span>
          <span>${shortName}</span>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [0, 0],
    popupAnchor: [0, -48],
  });
};

/**
 * Creates a custom HTML DivIcon for Delivery Destination (Customer drop-off)
 * @param {string} label - Recipient or Address label
 */
export const createDestinationIcon = (label = "Delivery Point") => {
  const shortLabel = label.length > 18 ? label.slice(0, 16) + "..." : label;

  return L.divIcon({
    className: "cravings-destination-marker",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
        <div style="
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: linear-gradient(135deg, #059669, #10b981);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px -3px rgba(16, 185, 129, 0.45);
          border: 2.5px solid #ffffff;
          font-size: 19px;
        ">
          📍
        </div>
        <div style="
          margin-top: 4px;
          padding: 2px 8px;
          border-radius: 6px;
          background: #064e3b;
          color: #a7f3d0;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        ">
          ${shortLabel}
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [0, 0],
    popupAnchor: [0, -44],
  });
};

/**
 * Creates a simple pin marker for interactive address selection
 */
export const createPickerPinIcon = () => {
  return L.divIcon({
    className: "cravings-picker-pin",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div class="animate-bounce" style="
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          background: #ea580c;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.5);
          border: 3px solid #ffffff;
          font-size: 18px;
        ">
          📍
        </div>
        <div style="
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.4);
          margin-top: 2px;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [0, 0],
    popupAnchor: [0, -40],
  });
};
