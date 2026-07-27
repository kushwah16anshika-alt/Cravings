// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import { MdOutlineDeliveryDining } from "react-icons/md";
// import { useAuth } from "../../../context/AuthContext";
// import api from "../../../config/api.config.js";
// import runningLoader from "../../../assets/runningLoader.gif";

// const CreateRiderProfile = ({ onSuccess, onCancel }) => {
//   const { user, setUser } = useAuth();

//   const [isLoading, setIsLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     vehicleType: "bike",
//     vehicleNumber: "",
//     vehicleModel: "",
//     vehicleColor: "",
//     drivingLicense: "",
//     vehicleRegistrationCertificate: "",
//     insuranceCertificate: "",
//     aadharCard: "",
//     panCard: "",
//     address: "",
//     city: "",
//     state: "",
//     pinCode: "",
//     country: "",
//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setIsLoading(true);

//       const response = await api.put("/rider/update-profile", {
//         vehicleDetails: {
//           vehicleType: formData.vehicleType,
//           vehicleNumber: formData.vehicleNumber,
//           vehicleModel: formData.vehicleModel,
//           vehicleColor: formData.vehicleColor,
//         },

//         documents: {
//           drivingLicense: formData.drivingLicense,
//           vehicleRegistrationCertificate:
//             formData.vehicleRegistrationCertificate,
//           insuranceCertificate: formData.insuranceCertificate,
//           aadharCard: formData.aadharCard,
//           panCard: formData.panCard,
//         },

//         currentAddress: {
//           address: formData.address,
//           city: formData.city,
//           state: formData.state,
//           pinCode: formData.pinCode,
//           country: formData.country,
//         },

//         financialDetails: {
//           bankName: formData.bankName,
//           accountNumber: formData.accountNumber,
//           ifscCode: formData.ifscCode,
//         },
//       });

//       setUser({
//         ...user,
//         riderProfile: response.data.data,
//       });

//       sessionStorage.setItem(
//         "cravingUser",
//         JSON.stringify({
//           ...user,
//           riderProfile: response.data.data,
//         }),
//       );

//       toast.success(
//         response.data.message || "Rider profile created successfully",
//       );

//       if (onSuccess) onSuccess();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Failed to create rider profile",
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-6 overflow-y-auto h-full p-6"
//     >
//       <div className="bg-(--color-primary) text-(--color-primary-content) rounded-xl p-6">
//         <h2 className="text-2xl font-bold flex items-center gap-2">
//           <MdOutlineDeliveryDining />
//           Create Rider Profile
//         </h2>

//         <p className="mt-2">Complete your rider details to start delivery.</p>
//       </div>

//       <div className="bg-(--color-base-100) p-6 rounded-xl shadow">
//         <h3 className="text-xl font-bold mb-5">Vehicle Details</h3>

//         <div className="grid grid-cols-2 gap-4">
//           {[
//             ["vehicleNumber", "Vehicle Number"],
//             ["vehicleModel", "Vehicle Model"],
//             ["vehicleColor", "Vehicle Color"],
//           ].map(([name, label]) => (
//             <input
//               key={name}
//               name={name}
//               placeholder={label}
//               value={formData[name]}
//               onChange={handleChange}
//               className="px-3 py-2 rounded border"
//               required
//             />
//           ))}

//           <select
//             name="vehicleType"
//             value={formData.vehicleType}
//             onChange={handleChange}
//             className="px-3 py-2 rounded border"
//           >
//             <option value="bike">Bike</option>

//             <option value="scooter">Scooter</option>

//             <option value="bicycle">Bicycle</option>
//           </select>
//         </div>
//       </div>

//       <div className="bg-(--color-base-100) p-6 rounded-xl shadow">
//         <h3 className="text-xl font-bold mb-5">Documents</h3>

//         <div className="grid grid-cols-2 gap-4">
//           {[
//             ["drivingLicense", "Driving License"],
//             ["vehicleRegistrationCertificate", "Vehicle RC"],
//             ["insuranceCertificate", "Insurance"],
//             ["aadharCard", "Aadhar Card"],
//             ["panCard", "PAN Card"],
//           ].map(([name, label]) => (
//             <input
//               key={name}
//               name={name}
//               placeholder={label}
//               value={formData[name]}
//               onChange={handleChange}
//               className="px-3 py-2 rounded border"
//               required
//             />
//           ))}
//         </div>
//       </div>

//       <div className="bg-(--color-base-100) p-6 rounded-xl shadow">
//         <h3 className="text-xl font-bold mb-5">Address</h3>

//         <div className="grid grid-cols-2 gap-4">
//           {[
//             ["address", "Address"],
//             ["city", "City"],
//             ["state", "State"],
//             ["pinCode", "Pin Code"],
//             ["country", "Country"],
//           ].map(([name, label]) => (
//             <input
//               key={name}
//               name={name}
//               placeholder={label}
//               value={formData[name]}
//               onChange={handleChange}
//               className="px-3 py-2 rounded border"
//               required
//             />
//           ))}
//         </div>
//       </div>

//       <div className="bg-(--color-base-100) p-6 rounded-xl shadow">
//         <h3 className="text-xl font-bold mb-5">Bank Details</h3>

//         <div className="grid grid-cols-2 gap-4">
//           {[
//             ["bankName", "Bank Name"],
//             ["accountNumber", "Account Number"],
//             ["ifscCode", "IFSC Code"],
//           ].map(([name, label]) => (
//             <input
//               key={name}
//               name={name}
//               placeholder={label}
//               value={formData[name]}
//               onChange={handleChange}
//               className="px-3 py-2 rounded border"
//               required
//             />
//           ))}
//         </div>
//       </div>

//       <div className="flex justify-end gap-3">
//         {onCancel && (
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-5 py-2 rounded bg-gray-300"
//           >
//             Cancel
//           </button>
//         )}

//         <button
//           disabled={isLoading}
//           className="px-6 py-2 rounded bg-(--color-primary) text-(--color-primary-content)"
//         >
//           {isLoading ? (
//             <img src={runningLoader} className="w-5 h-5" />
//           ) : (
//             "Create Profile"
//           )}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default CreateRiderProfile;


import React, { useState } from "react";
import toast from "react-hot-toast";

import {
    MdOutlineDeliveryDining,
    MdDirectionsBike,
    MdLocationOn,
} from "react-icons/md";

import {
    FaFileAlt,
    FaUniversity,
    FaIdCard,
} from "react-icons/fa";

import { useAuth } from "../../../context/AuthContext";
import api from "../../../config/api.config";
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

    const handleChange = ({ target }) => {
        setFormData((prev) => ({
            ...prev,
            [target.name]: target.value,
        }));
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
                })
            );

            toast.success(response.data.message);

            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to create profile"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle =
        "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200";

    return (
        <form
            onSubmit={handleSubmit}
            className="h-full overflow-y-auto space-y-8 p-8"
        >
            <>
                {/* Header */}
                <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-amber-400 p-8 text-white shadow-xl">
                    <div className="flex items-center gap-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                            <MdOutlineDeliveryDining size={34} />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold">Create Rider Profile</h2>

                            <p className="mt-1 text-white/90">
                                Complete your rider information to start accepting delivery orders.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className="rounded-3xl bg-white p-8 shadow-lg">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-orange-100 p-3 text-orange-500">
                            <MdDirectionsBike size={24} />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                Vehicle Details
                            </h3>

                            <p className="text-sm text-gray-500">
                                Enter the vehicle you'll use for deliveries.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Vehicle Type
                            </label>

                            <select
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleChange}
                                className={inputStyle}
                            >
                                <option value="bike">Bike</option>
                                <option value="scooter">Scooter</option>
                                <option value="bicycle">Bicycle</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Vehicle Number
                            </label>

                            <input
                                name="vehicleNumber"
                                value={formData.vehicleNumber}
                                onChange={handleChange}
                                placeholder="MH12 AB 1234"
                                className={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Vehicle Model
                            </label>

                            <input
                                name="vehicleModel"
                                value={formData.vehicleModel}
                                onChange={handleChange}
                                placeholder="Honda Activa"
                                className={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Vehicle Color
                            </label>

                            <input
                                name="vehicleColor"
                                value={formData.vehicleColor}
                                onChange={handleChange}
                                placeholder="Black"
                                className={inputStyle}
                                required
                            />
                        </div>
                    </div>
                </div>
                {/* Documents */}
                <div className="rounded-3xl bg-white p-8 shadow-lg">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-orange-100 p-3 text-orange-500">
                            <FaFileAlt size={22} />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                Documents
                            </h3>

                            <p className="text-sm text-gray-500">
                                Enter your government and vehicle document details.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Driving License
                            </label>

                            <input
                                name="drivingLicense"
                                value={formData.drivingLicense}
                                onChange={handleChange}
                                placeholder="DL Number"
                                className={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Vehicle Registration Certificate
                            </label>

                            <input
                                name="vehicleRegistrationCertificate"
                                value={formData.vehicleRegistrationCertificate}
                                onChange={handleChange}
                                placeholder="RC Number"
                                className={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Insurance Certificate
                            </label>

                            <input
                                name="insuranceCertificate"
                                value={formData.insuranceCertificate}
                                onChange={handleChange}
                                placeholder="Insurance Number"
                                className={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Aadhaar Card
                            </label>

                            <input
                                name="aadharCard"
                                value={formData.aadharCard}
                                onChange={handleChange}
                                placeholder="Aadhaar Number"
                                className={inputStyle}
                                required
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="mb-2 block font-medium text-gray-700">
                                PAN Card
                            </label>

                            <input
                                name="panCard"
                                value={formData.panCard}
                                onChange={handleChange}
                                placeholder="PAN Number"
                                className={inputStyle}
                                required
                            />
                        </div>

                    </div>
                </div>
                {/* Address */}
                <div className="rounded-3xl bg-white p-8 shadow-lg">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-orange-100 p-3 text-orange-500">
                            <MdLocationOn size={24} />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                Current Address
                            </h3>

                            <p className="text-sm text-gray-500">
                                This address will be used for verification and communication.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                        {/* Full Width Address */}
                        <div className="lg:col-span-2">
                            <label className="mb-2 block font-medium text-gray-700">
                                Street Address
                            </label>

                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your complete address"
                                className={inputStyle}
                                required
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                City
                            </label>

                            <input
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                className={inputStyle}
                                required
                            />
                        </div>

                        {/* State */}
                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                State
                            </label>

                            <input
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="State"
                                className={inputStyle}
                                required
                            />
                        </div>

                        {/* Pincode */}
                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                PIN Code
                            </label>

                            <input
                                name="pinCode"
                                value={formData.pinCode}
                                onChange={handleChange}
                                placeholder="400001"
                                className={inputStyle}
                                required
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Country
                            </label>

                            <input
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="India"
                                className={inputStyle}
                                required
                            />
                        </div>

                    </div>
                </div>
                {/* Bank Details */}
                <div className="rounded-3xl bg-white p-8 shadow-lg">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-orange-100 p-3 text-orange-500">
                            <FaUniversity size={22} />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                Bank Details
                            </h3>

                            <p className="text-sm text-gray-500">
                                This account will be used to receive your delivery earnings.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                        <div className="lg:col-span-2">
                            <label className="mb-2 block font-medium text-gray-700">
                                Bank Name
                            </label>

                            <input
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                placeholder="State Bank of India"
                                className={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Account Number
                            </label>

                            <input
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                placeholder="Enter account number"
                                className={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                IFSC Code
                            </label>

                            <input
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleChange}
                                placeholder="SBIN0001234"
                                className={inputStyle}
                                required
                            />
                        </div>

                    </div>
                </div>

                {/* Buttons */}
                <div className="sticky bottom-0 flex justify-end gap-4 rounded-2xl bg-white p-6 shadow-2xl">

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex min-w-[200px] items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-3 font-semibold text-white shadow-lg transition duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isLoading ? (
                            <>
                                <img
                                    src={runningLoader}
                                    alt="Loading"
                                    className="mr-2 h-6 w-6"
                                />
                                Saving...
                            </>
                        ) : (
                            <>
                                <MdOutlineDeliveryDining className="mr-2 text-xl" />
                                Create Profile
                            </>
                        )}
                    </button>

                </div>

            </>
        </form>
    );
};

export default CreateRiderProfile;