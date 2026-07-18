import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../config/api.config.js";
import runningLoader from "../../../assets/runningLoader.gif";

const CreateRiderProfile = ({ onSuccess, onCancel }) => {
  const { user, setUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleType: "bike",
    vehicleNumber: "",
    vehicleModel: "",
    vehicleColor: "",
    drivingLicense: "",
    vehicleRegistrationCertificate: "",
    insuranceCertificate: "",
    aadharCard: "",
    panCard: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await api.put("/rider/update-profile", {
        vehicleDetails: {
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
          vehicleModel: formData.vehicleModel,
          vehicleColor: formData.vehicleColor,
        },

        documents: {
          drivingLicense: formData.drivingLicense,
          vehicleRegistrationCertificate:
            formData.vehicleRegistrationCertificate,
          insuranceCertificate: formData.insuranceCertificate,
          aadharCard: formData.aadharCard,
          panCard: formData.panCard,
        },

        currentAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          country: formData.country,
        },

        financialDetails: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
        },
      });

      setUser({
        ...user,
        riderProfile: response.data.data,
      });

      sessionStorage.setItem(
        "cravingUser",
        JSON.stringify({
          ...user,
          riderProfile: response.data.data,
        }),
      );

      toast.success(
        response.data.message || "Rider profile created successfully",
      );

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create rider profile",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 overflow-y-auto h-full p-6"
    >
      <div className="bg-(--color-primary) text-(--color-primary-content) rounded-xl p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MdOutlineDeliveryDining />
          Create Rider Profile
        </h2>

        <p className="mt-2">Complete your rider details to start delivery.</p>
      </div>

      <div className="bg-(--color-base-100) p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-5">Vehicle Details</h3>

        <div className="grid grid-cols-2 gap-4">
          {[
            ["vehicleNumber", "Vehicle Number"],
            ["vehicleModel", "Vehicle Model"],
            ["vehicleColor", "Vehicle Color"],
          ].map(([name, label]) => (
            <input
              key={name}
              name={name}
              placeholder={label}
              value={formData[name]}
              onChange={handleChange}
              className="px-3 py-2 rounded border"
              required
            />
          ))}

          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="px-3 py-2 rounded border"
          >
            <option value="bike">Bike</option>

            <option value="scooter">Scooter</option>

            <option value="bicycle">Bicycle</option>
          </select>
        </div>
      </div>

      <div className="bg-(--color-base-100) p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-5">Documents</h3>

        <div className="grid grid-cols-2 gap-4">
          {[
            ["drivingLicense", "Driving License"],
            ["vehicleRegistrationCertificate", "Vehicle RC"],
            ["insuranceCertificate", "Insurance"],
            ["aadharCard", "Aadhar Card"],
            ["panCard", "PAN Card"],
          ].map(([name, label]) => (
            <input
              key={name}
              name={name}
              placeholder={label}
              value={formData[name]}
              onChange={handleChange}
              className="px-3 py-2 rounded border"
              required
            />
          ))}
        </div>
      </div>

      <div className="bg-(--color-base-100) p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-5">Address</h3>

        <div className="grid grid-cols-2 gap-4">
          {[
            ["address", "Address"],
            ["city", "City"],
            ["state", "State"],
            ["pinCode", "Pin Code"],
            ["country", "Country"],
          ].map(([name, label]) => (
            <input
              key={name}
              name={name}
              placeholder={label}
              value={formData[name]}
              onChange={handleChange}
              className="px-3 py-2 rounded border"
              required
            />
          ))}
        </div>
      </div>

      <div className="bg-(--color-base-100) p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-5">Bank Details</h3>

        <div className="grid grid-cols-2 gap-4">
          {[
            ["bankName", "Bank Name"],
            ["accountNumber", "Account Number"],
            ["ifscCode", "IFSC Code"],
          ].map(([name, label]) => (
            <input
              key={name}
              name={name}
              placeholder={label}
              value={formData[name]}
              onChange={handleChange}
              className="px-3 py-2 rounded border"
              required
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded bg-gray-300"
          >
            Cancel
          </button>
        )}

        <button
          disabled={isLoading}
          className="px-6 py-2 rounded bg-(--color-primary) text-(--color-primary-content)"
        >
          {isLoading ? (
            <img src={runningLoader} className="w-5 h-5" />
          ) : (
            "Create Profile"
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateRiderProfile;
