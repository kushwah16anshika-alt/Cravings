import React from "react";
import PresonalInformation from "./PresonalInformation";
import RestaurantInformation from "./RestaurantInformation";
import LeagalInformation from "./LegalInformation";

const Index = () => {
  return (
    <div className="h-full overflow-y-auto p-2 space-y-2">
      <PresonalInformation />
      <RestaurantInformation />
      <LeagalInformation />
    </div>
  );
};

export default Index;