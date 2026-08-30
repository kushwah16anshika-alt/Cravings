import React from "react";

const RestaurantAbout = ({ description }) => (
  <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-2">
    <h3 className="font-heading text-xs font-black text-orange-600 uppercase tracking-widest">
      About the Kitchen
    </h3>
    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
      {description || "Authentic recipes crafted with quality ingredients and strict hygiene standards."}
    </p>
  </div>
);

export default RestaurantAbout;