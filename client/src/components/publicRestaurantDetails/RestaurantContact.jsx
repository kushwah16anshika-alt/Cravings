import React from "react";
import {
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoMapOutline,
} from "react-icons/io5";
import RestaurantLocationMap from "../map/RestaurantLocationMap";

const RestaurantContact = ({ restaurant }) => {
  const { contactDetails, address, city, state, pinCode, country } = restaurant;
  const hasContact = contactDetails?.phone || contactDetails?.email;
  const hasAddress = address || city;

  if (!hasContact && !hasAddress) return null;

  return (
    <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-3.5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <h3 className="font-heading text-xs font-black text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
          <IoMapOutline size={15} />
          <span>Contact & Location</span>
        </h3>
        <span className="text-[10px] font-bold text-slate-400">OpenStreetMap</span>
      </div>

      <div className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-700">
        {contactDetails?.phone && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <IoCallOutline size={15} />
            </div>
            <span>{contactDetails.phone}</span>
          </div>
        )}

        {contactDetails?.email && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <IoMailOutline size={15} />
            </div>
            <span className="truncate">{contactDetails.email}</span>
          </div>
        )}

        {hasAddress && (
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600 mt-0.5">
              <IoLocationOutline size={15} />
            </div>
            <span className="text-slate-600 leading-snug">
              {[address, city, state, pinCode, country].filter(Boolean).join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Interactive OpenStreetMap for Restaurant Location */}
      <div className="pt-2">
        <RestaurantLocationMap restaurant={restaurant} height="200px" />
      </div>
    </div>
  );
};

export default RestaurantContact;