import React, { useState } from "react";
import {
  MdDirectionsBike,
  MdDescription,
  MdLocationOn,
  MdAccountBalance,
  MdEdit,
} from "react-icons/md";
import api from "../../../config/api.config";

const InputField = ({ label, name, value, editing, onChange }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    {editing ? (
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[var(--accent)]"
      />
    ) : (
      <p className="mt-2 font-semibold text-gray-800">{value || "-"}</p>
    )}
  </div>
);

const RiderProfile = ({ profileData }) => {
  const [activeTab, setActiveTab] = useState("vehicle");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profileData);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      await api.put("/rider/update-profile", form);
      setEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const tabs = [
    { id: "vehicle", label: "Vehicle", icon: <MdDirectionsBike /> },
    { id: "documents", label: "Documents", icon: <MdDescription /> },
    { id: "address", label: "Address", icon: <MdLocationOn /> },
    { id: "financial", label: "Financial", icon: <MdAccountBalance /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Rider Profile</h1>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--accent)] text-white"
          >
            <MdEdit /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setForm(profileData);
                setEditing(false);
              }}
              className="px-5 py-3 rounded-xl border border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={saveProfile}
              className="px-5 py-3 rounded-xl bg-[var(--accent)] text-white"
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-2 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition ${
              activeTab === tab.id
                ? "bg-[var(--accent)] text-white"
                : "text-gray-600 hover:bg-orange-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-7 grid md:grid-cols-2 gap-5">
        {activeTab === "vehicle" && (
          <>
            <InputField label="Vehicle Type" name="vehicleType" value={form?.vehicleDetails?.vehicleType} editing={editing} onChange={handleChange} />
            <InputField label="Vehicle Model" name="vehicleModel" value={form?.vehicleDetails?.vehicleModel} editing={editing} onChange={handleChange} />
            <InputField label="Vehicle Number" name="vehicleNumber" value={form?.vehicleDetails?.vehicleNumber} editing={editing} onChange={handleChange} />
            <InputField label="Vehicle Color" name="vehicleColor" value={form?.vehicleDetails?.vehicleColor} editing={editing} onChange={handleChange} />
          </>
        )}

        {activeTab === "documents" && (
          <>
            <InputField label="Driving License" name="drivingLicense" value={form?.documents?.drivingLicense} editing={editing} onChange={handleChange} />
            <InputField label="Aadhar Card" name="aadharCard" value={form?.documents?.aadharCard} editing={editing} onChange={handleChange} />
            <InputField label="PAN Card" name="panCard" value={form?.documents?.panCard} editing={editing} onChange={handleChange} />
            <InputField label="Vehicle RC" name="vehicleRC" value={form?.documents?.vehicleRegistrationCertificate} editing={editing} onChange={handleChange} />
          </>
        )}

        {activeTab === "address" && (
          <>
            <InputField label="Address" name="address" value={form?.currentAddress?.address} editing={editing} onChange={handleChange} />
            <InputField label="City" name="city" value={form?.currentAddress?.city} editing={editing} onChange={handleChange} />
            <InputField label="State" name="state" value={form?.currentAddress?.state} editing={editing} onChange={handleChange} />
            <InputField label="Pin Code" name="pinCode" value={form?.currentAddress?.pinCode} editing={editing} onChange={handleChange} />
          </>
        )}

        {activeTab === "financial" && (
          <>
            <InputField label="Bank Name" name="bankName" value={form?.financialDetails?.bankName} editing={editing} onChange={handleChange} />
            <InputField label="Account Number" name="accountNumber" value={form?.financialDetails?.accountNumber} editing={editing} onChange={handleChange} />
            <InputField label="IFSC Code" name="ifscCode" value={form?.financialDetails?.ifscCode} editing={editing} onChange={handleChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default RiderProfile;