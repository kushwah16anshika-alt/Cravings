import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../config/api.config";
import toast from "react-hot-toast";
import { RiLoader4Fill } from "react-icons/ri";

const RiderProfileView = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [riderData, setRiderData] = useState({
    vehicleDetails: {
      vehicleType: "Bike",
      vehicleNumber: "",
      vehicleModel: "",
      vehicleColor: "",
    },
    documents: {
      drivingLicense: "",
      vehicleRegistrationCertificate: "",
      insuranceCertificate: "",
      aadharCard: "",
      panCard: "",
    },
    currentAddress: {
      address: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
    },
    financialDetails: {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
    },
    isAvailable: true,
    status: "active",
    averageRating: 4.8,
  });

  const fetchRiderProfile = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/rider/get-profile");
      if (res.data?.data) {
        setRiderData((prev) => ({
          ...prev,
          ...res.data.data,
          vehicleDetails: {
            ...prev.vehicleDetails,
            ...(res.data.data.vehicleDetails || {}),
          },
          documents: {
            ...prev.documents,
            ...(res.data.data.documents || {}),
          },
          currentAddress: {
            ...prev.currentAddress,
            ...(res.data.data.currentAddress || {}),
          },
          financialDetails: {
            ...prev.financialDetails,
            ...(res.data.data.financialDetails || {}),
          },
        }));
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        toast.error("Could not fetch rider profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderProfile();
  }, []);

  const handleNestedChange = (section, field, value) => {
    setRiderData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    try {
      setIsSaving(true);
      const res = await api.post("/rider/update-profile", riderData);
      toast.success(res.data?.message || "Rider profile updated successfully");
      if (res.data?.data) {
        setRiderData((prev) => ({ ...prev, ...res.data.data }));
      }
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save rider information");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <RiLoader4Fill className="animate-spin text-2xl text-slate-400 mb-2" />
        <p className="text-xs text-slate-500">Loading partner records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80">
        <div>
          <h1 className="font-heading text-xl font-bold text-slate-900">
            Vehicle & Verification
          </h1>
          <p className="text-xs text-slate-500">
            Manage your registered vehicle specs and payout details.
          </p>
        </div>

        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition"
            >
              Edit Details
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchRiderProfile();
                }}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* 1. Vehicle Details */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Vehicle Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Vehicle Type
              </label>
              {isEditing ? (
                <select
                  value={riderData.vehicleDetails.vehicleType}
                  onChange={(e) =>
                    handleNestedChange("vehicleDetails", "vehicleType", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-hidden"
                >
                  <option value="Bike">Motorcycle / Bike</option>
                  <option value="Scooter">Scooter / Scooty</option>
                  <option value="Electric Scooter">EV Scooter</option>
                  <option value="Bicycle">Bicycle</option>
                </select>
              ) : (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800">
                  {riderData.vehicleDetails.vehicleType || "Motorcycle / Bike"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Registration Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="MP 04 AB 1234"
                  value={riderData.vehicleDetails.vehicleNumber}
                  onChange={(e) =>
                    handleNestedChange("vehicleDetails", "vehicleNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium uppercase focus:border-orange-500 focus:outline-hidden"
                />
              ) : (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800 uppercase">
                  {riderData.vehicleDetails.vehicleNumber || "MP 04 AB 9876"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Model Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="Honda Activa 6G"
                  value={riderData.vehicleDetails.vehicleModel}
                  onChange={(e) =>
                    handleNestedChange("vehicleDetails", "vehicleModel", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-hidden"
                />
              ) : (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800">
                  {riderData.vehicleDetails.vehicleModel || "Honda Activa 6G"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Color
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="Matte Black"
                  value={riderData.vehicleDetails.vehicleColor}
                  onChange={(e) =>
                    handleNestedChange("vehicleDetails", "vehicleColor", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-hidden"
                />
              ) : (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800">
                  {riderData.vehicleDetails.vehicleColor || "Matte Black"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Documents */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Verification & Licenses
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Driving License No.
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="DL-0420110012345"
                  value={riderData.documents.drivingLicense}
                  onChange={(e) =>
                    handleNestedChange("documents", "drivingLicense", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium uppercase focus:border-orange-500 focus:outline-hidden"
                />
              ) : (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800 uppercase">
                  {riderData.documents.drivingLicense || "DL-0420220084920"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Aadhar Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="XXXX XXXX 5678"
                  value={riderData.documents.aadharCard}
                  onChange={(e) =>
                    handleNestedChange("documents", "aadharCard", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-hidden"
                />
              ) : (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800">
                  {riderData.documents.aadharCard || "XXXX XXXX 4920"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                PAN Card
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  value={riderData.documents.panCard}
                  onChange={(e) =>
                    handleNestedChange("documents", "panCard", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium uppercase focus:border-orange-500 focus:outline-hidden"
                />
              ) : (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800 uppercase">
                  {riderData.documents.panCard || "ABCDE7890F"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Payout Details */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Bank Details (Payout)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Bank Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="HDFC Bank"
                  value={riderData.financialDetails.bankName}
                  onChange={(e) =>
                    handleNestedChange("financialDetails", "bankName", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-hidden"
                />
              ) : (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800">
                  {riderData.financialDetails.bankName || "HDFC Bank"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Account Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="50100234567890"
                  value={riderData.financialDetails.accountNumber}
                  onChange={(e) =>
                    handleNestedChange("financialDetails", "accountNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-hidden"
                />
              ) : (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800">
                  {riderData.financialDetails.accountNumber
                    ? `•••• •••• ${riderData.financialDetails.accountNumber.slice(-4)}`
                    : "•••• •••• 7890"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                IFSC Code
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="HDFC0001234"
                  value={riderData.financialDetails.ifscCode}
                  onChange={(e) =>
                    handleNestedChange("financialDetails", "ifscCode", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium uppercase focus:border-orange-500 focus:outline-hidden"
                />
              ) : (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800 uppercase">
                  {riderData.financialDetails.ifscCode || "HDFC0000456"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. Base Address */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Base Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Address / Street
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="Hostel Block 4, Campus Hub"
                  value={riderData.currentAddress.address}
                  onChange={(e) =>
                    handleNestedChange("currentAddress", "address", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-hidden"
                />
              ) : (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800">
                  {riderData.currentAddress.address || "Hostel Sector 4, Campus Hub"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="Bhopal"
                  value={riderData.currentAddress.city}
                  onChange={(e) =>
                    handleNestedChange("currentAddress", "city", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-hidden"
                />
              ) : (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800">
                  {riderData.currentAddress.city || "Bhopal"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                State & Pincode
              </label>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MP"
                    value={riderData.currentAddress.state}
                    onChange={(e) =>
                      handleNestedChange("currentAddress", "state", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="462001"
                    value={riderData.currentAddress.pinCode}
                    onChange={(e) =>
                      handleNestedChange("currentAddress", "pinCode", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800">
                  {riderData.currentAddress.state || "MP"} -{" "}
                  {riderData.currentAddress.pinCode || "462001"}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RiderProfileView;
