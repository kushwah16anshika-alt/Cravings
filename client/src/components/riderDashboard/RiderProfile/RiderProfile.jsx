import React, { useEffect, useState } from "react";
import { MdOutlineDeliveryDining, MdAddCircleOutline } from "react-icons/md";
import api from "../../../config/api.config.js";
import CreateRiderProfile from "./CreateRiderProfile";

const VehicleDetails = ({ data }) => (
  <div className="bg-(--color-base-100) p-6 rounded-xl shadow-md">
    <h3 className="text-xl font-bold mb-5">Vehicle Details</h3>

    <div className="grid grid-cols-2 gap-4">
      <p>Type: {data?.vehicleDetails?.vehicleType}</p>
      <p>Model: {data?.vehicleDetails?.vehicleModel}</p>
      <p>Number: {data?.vehicleDetails?.vehicleNumber}</p>
      <p>Color: {data?.vehicleDetails?.vehicleColor}</p>
    </div>
  </div>
);

const RiderDocuments = ({ data }) => (
  <div className="bg-(--color-base-100) p-6 rounded-xl shadow-md">
    <h3 className="text-xl font-bold mb-5">Documents</h3>

    <div className="grid grid-cols-2 gap-4">
      <p>Driving License: {data?.documents?.drivingLicense}</p>
      <p>Aadhar Card: {data?.documents?.aadharCard}</p>
      <p>PAN Card: {data?.documents?.panCard}</p>
      <p>Vehicle RC: {data?.documents?.vehicleRegistrationCertificate}</p>
      <p>Insurance: {data?.documents?.insuranceCertificate}</p>
    </div>
  </div>
);

const AddressDetails = ({ data }) => (
  <div className="bg-(--color-base-100) p-6 rounded-xl shadow-md">
    <h3 className="text-xl font-bold mb-5">Address</h3>

    <div className="grid grid-cols-2 gap-4">
      <p>Address: {data?.currentAddress?.address}</p>
      <p>City: {data?.currentAddress?.city}</p>
      <p>State: {data?.currentAddress?.state}</p>
      <p>Pin Code: {data?.currentAddress?.pinCode}</p>
      <p>Country: {data?.currentAddress?.country}</p>
    </div>
  </div>
);

const FinancialDetails = ({ data }) => (
  <div className="bg-(--color-base-100) p-6 rounded-xl shadow-md">
    <h3 className="text-xl font-bold mb-5">Financial Details</h3>

    <div className="grid grid-cols-2 gap-4">
      <p>Bank Name: {data?.financialDetails?.bankName}</p>
      <p>Account Number: {data?.financialDetails?.accountNumber}</p>
      <p>IFSC Code: {data?.financialDetails?.ifscCode}</p>
    </div>
  </div>
);

const RiderProfileContainer = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState("vehicle");

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await api.get("/rider/get-profile");

      setProfileData(res.data.data || null);
    } catch (error) {
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading Profile...</div>;
  }

  if (!profileData && showCreateForm) {
    return (
      <CreateRiderProfile
        onSuccess={() => {
          setShowCreateForm(false);
          fetchProfile();
        }}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-(--color-base-100) rounded-xl shadow">
        <MdOutlineDeliveryDining className="text-6xl text-(--color-primary)" />

        <h2 className="text-3xl font-bold mt-5">Welcome Rider!</h2>

        <p className="text-center mt-3 opacity-70">
          Create your rider profile to start receiving orders.
        </p>

        <button
          onClick={() => setShowCreateForm(true)}
          className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-(--color-primary) text-(--color-primary-content)"
        >
          <MdAddCircleOutline />
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-5 border-b pb-3">
        {[
          ["vehicle", "Vehicle"],
          ["documents", "Documents"],
          ["address", "Address"],
          ["financial", "Financial"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`font-semibold ${
              activeTab === value
                ? "text-(--color-primary) border-b-2 border-(--color-primary)"
                : "opacity-60"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "vehicle" && <VehicleDetails data={profileData} />}

      {activeTab === "documents" && <RiderDocuments data={profileData} />}

      {activeTab === "address" && <AddressDetails data={profileData} />}

      {activeTab === "financial" && <FinancialDetails data={profileData} />}
    </div>
  );
};

export default RiderProfileContainer;
