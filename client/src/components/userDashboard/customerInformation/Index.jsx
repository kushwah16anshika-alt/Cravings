import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import PasswordChangeModal from "../../../components/commomModals/PasswordChangeModal.jsx";
import { MdEdit, MdOutlineAddAPhoto, MdOutlineLockReset } from "react-icons/md";
import api from "../../../config/api.config.js";
import toast from "react-hot-toast";

const Index = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [profileFormData, setProfileFormData] = useState({
    fullName: user?.fullName || user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData({ ...profileFormData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      const payload = new FormData();
      payload.append("fullName", profileFormData.fullName);
      payload.append("email", profileFormData.email.toLowerCase());
      payload.append("phone", profileFormData.phone);
      if (profilePic) {
        payload.append("displayPic", profilePic);
      }

      const response = await api.put(`/common/edit-profile`, payload);
      setUser(response.data.data);
      sessionStorage.setItem("cravingUser", JSON.stringify(response.data.data));
      setEditingProfile(false);
      toast.success("Profile details updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelProfile = () => {
    setProfileFormData({
      fullName: user?.fullName || user?.fullname || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setProfilePicPreview(null);
    setEditingProfile(false);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
      setProfilePic(file);
    }
  };

  const userPhoto =
    profilePicPreview ||
    user?.photo?.url ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
      profileFormData.fullName || "User"
    )}`;

  return (
    <>
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
              Personal Information
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              Manage your profile details and security
            </p>
          </div>

          {!editingProfile ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingProfile(true)}
                className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-orange-500 transition shadow-xs shadow-orange-600/20"
              >
                <MdEdit />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => setIsPasswordChangeModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <MdOutlineLockReset size={16} />
                <span>Change Password</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelProfile}
                disabled={isLoading}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs shadow-orange-600/20 hover:bg-orange-500 transition"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar Section */}
          <div className="relative group">
            <img
              src={userPhoto}
              alt="Profile"
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-orange-500/20"
            />
            {editingProfile && (
              <label
                htmlFor="customerProfilePic"
                className="absolute inset-0 bg-black/50 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer transition"
              >
                <MdOutlineAddAPhoto size={18} />
                <span className="text-[10px] font-bold mt-1">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  id="customerProfilePic"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </label>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={profileFormData.fullName}
                onChange={handleProfileChange}
                disabled={!editingProfile}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium disabled:bg-slate-100/70 disabled:text-slate-500 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profileFormData.email}
                disabled
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100/70 border border-slate-200 text-xs sm:text-sm font-medium text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profileFormData.phone}
                onChange={handleProfileChange}
                disabled={!editingProfile}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium disabled:bg-slate-100/70 disabled:text-slate-500 focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
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

export default Index;