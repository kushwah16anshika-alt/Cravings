import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { MdOutlineAddAPhoto, MdOutlineLockReset } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import PasswordChangeModal from "../commonModals/PasswordChangeModal";

const CustomerSetting = () => {
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

      const response = await api.put("/user/edit-profile", payload);

      const updatedUser = response.data.data;

      setUser(updatedUser);

      sessionStorage.setItem(
        "cravingUser",
        JSON.stringify(updatedUser)
      );

      setProfilePic(null);
      setProfilePicPreview(null);

      toast.success("Profile updated successfully!");

      setEditingProfile(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
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
        <div className="bg-(--color-base-200) rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Profile Information
            </h3>

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
                  onClick={() =>
                    setIsPasswordChangeModalOpen(true)
                  }
                  className="flex items-center gap-2 border border-(--color-primary) text-(--color-primary) px-3 py-1 rounded text-sm hover:bg-(--color-primary) hover:text-(--color-primary-content)"
                >
                  <MdOutlineLockReset />
                  Change Password
                </button>
              </div>
            ) : (
              <div className="flex gap-2 justify-end">
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
                    <div>
            <div className="flex items-center gap-6">
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
                  <div
                    className="absolute cursor-pointer bottom-1 right-1 border p-2 rounded-full w-fit bg-(--color-base-200)"
                    title="Change Photo"
                  >
                    <label
                      htmlFor="profilePic"
                      className="cursor-pointer"
                    >
                      <MdOutlineAddAPhoto className="text-xl" />
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      name="profilePic"
                      id="profilePic"
                      className="hidden"
                      onChange={handleProfilePicChange}
                    />
                  </div>
                )}
              </div>
                            <div className="space-y-4 w-full">
                <div className="grid grid-cols-5 gap-2 justify-center items-center">
                  <label className="block text-sm font-semibold mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    className={`w-full px-3 py-2 border ${
                      editingProfile
                        ? "border-(--color-secondary)"
                        : "border-transparent"
                    } rounded col-span-4`}
                  />

                  <label className="block text-sm font-semibold mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    disabled
                    className={`w-full px-3 py-2 border ${
                      editingProfile
                        ? "border-(--color-secondary) text-(--color-secondary)"
                        : "border-transparent"
                    } rounded col-span-4`}
                  />

                  <label className="block text-sm font-semibold mb-2">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    className={`w-full px-3 py-2 border ${
                      editingProfile
                        ? "border-(--color-secondary)"
                        : "border-transparent"
                    } rounded col-span-4`}
                  />
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

export default CustomerSetting;