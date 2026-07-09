
import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";

const RiderSettings = () => {
  const { user, setUser } = useAuth();

  const [editingProfile, setEditingProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProfilePic(file);
    setProfilePicPreview(URL.createObjectURL(file));
  };
const handleSaveProfile = async () => {
  try {
    setIsLoading(true);

    const payload = new FormData();

    payload.append("fullname", formData.fullName);
    payload.append("email", formData.email.toLowerCase());
    payload.append("phone", formData.phone);

    if (profilePic) {
      payload.append("photo", profilePic);
    }

    console.log("Sending Data:");
    for (let item of payload.entries()) {
      console.log(item[0], item[1]);
    }

    const response = await api.put("/user/edit-profile", payload);

    const updatedUser = response.data.data;
    setUser(updatedUser);
    sessionStorage.setItem("UserData", JSON.stringify(updatedUser));

    setProfilePic(null);
    setProfilePicPreview(null);

    toast.success("Profile updated successfully!");
    setEditingProfile(false);
  } catch (error) {
    console.log("Update Error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to update profile");
  } finally {
    setIsLoading(false);
  }
};
  const handleCancelProfile = () => {
    setFormData({
      fullName: user?.fullname || "",

      email: user?.email || "",

      phone: user?.phone || "",
    });

    setProfilePic(null);

    setProfilePicPreview(null);

    setEditingProfile(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        {/* PROFILE IMAGE */}

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
              <img
                src={
                  profilePicPreview ||
                  user?.photo?.url ||
                  "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {editingProfile && (
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer">
                <label htmlFor="profilePic" className="cursor-pointer">
                  <MdOutlineAddAPhoto className="text-xl text-blue-600" />
                </label>

                <input
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </div>
            )}
          </div>

          <h2 className="mt-3 text-xl font-semibold text-gray-800">
            {user?.fullname}
          </h2>

          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* FORM */}

        <div className="space-y-4">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleProfileChange}
            disabled={!editingProfile}
            className={`w-full p-3 border rounded-lg ${
              editingProfile
                ? "focus:outline-none focus:ring-2 focus:ring-blue-400"
                : "bg-gray-100"
            }`}
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-500"
          />

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleProfileChange}
            disabled={!editingProfile}
            className={`w-full p-3 border rounded-lg ${
              editingProfile
                ? "focus:outline-none focus:ring-2 focus:ring-blue-400"
                : "bg-gray-100"
            }`}
          />
        </div>

        {/* BUTTONS */}

        <div className="mt-6 flex gap-3">
          {editingProfile ? (
            <>
              <button
                onClick={handleCancelProfile}
                disabled={isLoading}
                className="w-full py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditingProfile(true)}
              className="w-full py-2 rounded-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              <MdEdit />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderSettings;
