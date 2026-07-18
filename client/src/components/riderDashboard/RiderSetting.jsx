import React, { useState } from "react";
import { MdEdit, MdOutlineLockReset, MdOutlineAddAPhoto } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import PasswordChangeModal from "../commomModals/PasswordChangeModal.jsx";

const RiderSetting = () => {
  const { user, setUser } = useAuth();

  const [editingProfile, setEditingProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
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

      payload.append("fullName", formData.fullName);
      payload.append("email", formData.email.toLowerCase());
      payload.append("phone", formData.phone);

      if (profilePic) {
        payload.append("displayPic", profilePic);
      }

      const response = await api.put("/common/edit-profile", payload);

      setUser(response.data.data);

      sessionStorage.setItem(
        "cravingUser",
        JSON.stringify(response.data.data)
      );

      setEditingProfile(false);
      setProfilePic(null);
      setProfilePicPreview(null);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelProfile = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    setProfilePic(null);
    setProfilePicPreview(null);
    setEditingProfile(false);
  };

  return (
    <>
      <div className="overflow-y-auto h-full p-6 space-y-6">
        <div className="bg-(--color-base-100) rounded-2xl shadow-xl overflow-hidden border border-(--color-base-300)">
          <div className="h-32 bg-linear-to-r from-(--color-primary) to-(--color-secondary) relative">
            <div className="absolute top-4 right-4">
              {!editingProfile ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="flex items-center gap-2 bg-white text-(--color-primary) px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    <MdEdit />
                    Edit Profile
                  </button>

                  <button
                    onClick={() => setIsPasswordChangeModalOpen(true)}
                    className="flex items-center gap-2 bg-white text-(--color-primary) px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    <MdOutlineLockReset />
                    Change Password
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelProfile}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSaveProfile}
                    className="bg-white text-(--color-primary) px-4 py-2 rounded-lg font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="-mt-16 relative">
                <div className="w-32 h-32 rounded-full p-1 bg-white shadow-lg">
                  <img
                    src={
                      profilePicPreview ||
                      user?.photo?.url ||
                      "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />

                  {editingProfile && (
                    <>
                      <label
                        htmlFor="profilePic"
                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white cursor-pointer"
                      >
                        <MdOutlineAddAPhoto className="text-3xl" />
                      </label>

                      <input
                        id="profilePic"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePicChange}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="w-full mt-4">
                <h3 className="text-2xl font-bold">
                  {user?.fullName || "Rider Profile"}
                </h3>

                <p className="text-sm opacity-60 mb-6">
                  Manage your personal information and settings
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleProfileChange}
                      disabled={!editingProfile}
                      className="w-full px-4 py-3 bg-(--color-base-200) rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">
                      Email
                    </label>

                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 bg-(--color-base-200) rounded-xl"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold">
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleProfileChange}
                      disabled={!editingProfile}
                      className="w-full px-4 py-3 bg-(--color-base-200) rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPasswordChangeModalOpen && (
        <PasswordChangeModal
          open={isPasswordChangeModalOpen}
          onClose={() => setIsPasswordChangeModalOpen(false)}
        />
      )}
    </>
  );
};

export default RiderSetting;