import React from "react";
import Information from "./customerInformation/Index";
import AddressBook from "./coreDetails/Index";

const CustomerSetting = () => {
  return (
    <div className="space-y-6">
      <Information />
      <AddressBook />
    </div>
  );
};

export default CustomerSetting;