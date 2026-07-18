
import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { MdOutlineLockReset } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import PasswordChangeModal from "../commomModals/PasswordChangeModal.jsx";

const AdminSetting = () => {
  const { user, setUser } = useAuth();

  const [editingProfile, setEditingProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
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

      const response = await api.put("/user/edit-profile", payload);

      const updatedUser = response.data.data;

      setUser(updatedUser);

      sessionStorage.setItem("UserData", JSON.stringify(updatedUser));

      setProfilePic(null);

      setProfilePicPreview(null);

      setEditingProfile(false);

      toast.success("Profile updated successfully!");
    } catch (error) {
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
    <>
      <div className="overflow-y-auto h-full p-6 space-y-6">
        <div className="bg-(--color-base-200) rounded-lg p-6">
          {/* Header */}

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Profile Information</h3>

            {!editingProfile ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingProfile(true)}
                  className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-3 py-1 rounded text-sm"
                >
                  <MdEdit />
                  Edit
                </button>

                <button
                  onClick={() => setIsPasswordChangeModalOpen(true)}
                  className="flex items-center gap-2 border border-(--color-primary) text-(--color-primary) px-3 py-1 rounded text-sm hover:bg-(--color-primary) hover:text-(--color-primary-content)"
                >
                  <MdOutlineLockReset />
                  Change Password
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-3 py-1 rounded text-sm"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={handleCancelProfile}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-(--color-secondary) text-(--color-secondary-content) px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Content */}

          <div className="flex items-center gap-6">
            {/* Image */}

            <div className="relative">
              <div className="w-36 h-36">
                <img
                  src={
                    profilePicPreview ||
                    user?.photo?.url ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-2 border-(--color-primary)"
                />
              </div>

              {editingProfile && (
                <div className="absolute bottom-1 right-1 border p-2 rounded-full bg-(--color-base-200)">
                  <label htmlFor="profilePic" className="cursor-pointer">
                    <MdOutlineAddAPhoto className="text-xl" />
                  </label>

                  <input
                    type="file"
                    id="profilePic"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePicChange}
                  />
                </div>
              )}
            </div>

            {/* Form */}

            <div className="w-full">
              <div className="grid grid-cols-5 gap-3 items-center">
                <label className="font-semibold">Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleProfileChange}
                  disabled={!editingProfile}
                  className={`col-span-4 px-3 py-2 border rounded ${
                    editingProfile
                      ? "border-(--color-secondary)"
                      : "border-transparent"
                  }`}
                />

                <label className="font-semibold">Email</label>

                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="col-span-4 px-3 py-2 border rounded border-transparent bg-gray-100"
                />

                <label className="font-semibold">Phone</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleProfileChange}
                  disabled={!editingProfile}
                  className={`col-span-4 px-3 py-2 border rounded ${
                    editingProfile
                      ? "border-(--color-secondary)"
                      : "border-transparent"
                  }`}
                />
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

export default AdminSetting;
