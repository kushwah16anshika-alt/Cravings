import React from "react";
import Information from "./customerInformation/Index";
import AddressBook from "./coreDetails/Index";

const CustomerSetting = () => {
  return (
    <>
      <div className="h-full flex flex-col">
        <div className="h-full rounded-lg bg-(--color-base-200) p-2 overflow-y-auto space-y-2">
          <Information />
          <AddressBook />
        </div>
      </div>
    </>
  );
};

export default CustomerSetting;