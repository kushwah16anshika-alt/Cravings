import React, { useState } from "react";
import { MdEdit, MdOutlineAddAPhoto, MdOutlineLockReset } from "react-icons/md";
import { IoShieldCheckmark, IoMailOutline, IoCallOutline, IoPersonOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config.js";
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
    fullName: user?.fullName || user?.fullname || "",
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
      sessionStorage.setItem("cravingUser", JSON.stringify(response.data.data));

      setProfilePic(null);
      setProfilePicPreview(null);
      setEditingProfile(false);

      toast.success("Admin profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelProfile = () => {
    setFormData({
      fullName: user?.fullName || user?.fullname || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setProfilePic(null);
    setProfilePicPreview(null);
    setEditingProfile(false);
  };

  const avatar =
    profilePicPreview ||
    user?.photo?.url ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
      formData.fullName || "Admin"
    )}`;

  return (
    <>
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Header Banner */}
          <div className="h-36 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 relative p-6 flex items-start justify-end">
            <div className="flex gap-2">
              {!editingProfile ? (
                <>
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="flex items-center gap-1.5 bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-2xl text-xs font-black shadow-md transition active:scale-95"
                  >
                    <MdEdit size={16} />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => setIsPasswordChangeModalOpen(true)}
                    className="flex items-center gap-1.5 bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-2xl text-xs font-black shadow-md transition active:scale-95"
                  >
                    <MdOutlineLockReset size={16} />
                    <span>Security & Password</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancelProfile}
                    disabled={isLoading}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-2xl text-xs font-bold transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-white text-orange-600 px-5 py-2 rounded-2xl text-xs font-black shadow-md hover:bg-orange-50 transition"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Body */}
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Avatar with upload trigger */}
              <div className="-mt-14 relative flex-shrink-0">
                <div className="h-28 w-28 rounded-3xl p-1.5 bg-white shadow-xl border border-slate-100 relative group overflow-hidden">
                  <img
                    src={avatar}
                    alt="Admin Avatar"
                    className="w-full h-full rounded-2xl object-cover bg-slate-100"
                  />

                  {editingProfile && (
                    <label
                      htmlFor="adminProfilePic"
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer transition"
                    >
                      <MdOutlineAddAPhoto size={24} />
                      <span className="text-[9px] font-extrabold mt-1">Change</span>
                    </label>
                  )}
                </div>

                <input
                  type="file"
                  id="adminProfilePic"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                  disabled={!editingProfile}
                />
              </div>

              {/* Title and Info */}
              <div className="flex-1 min-w-0 pt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-900 truncate">
                    {formData.fullName || "Platform Admin"}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-700 px-2.5 py-0.5 text-[10px] font-black uppercase">
                    <IoShieldCheckmark />
                    <span>Administrator</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Highest-level privileges for system metrics, restaurant verification, and order supervision.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 pt-6 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <div className="relative">
                  <IoPersonOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600 text-base" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    className={`w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl border transition ${
                      editingProfile
                        ? "bg-white border-slate-300 focus:border-orange-500 focus:outline-hidden"
                        : "bg-slate-50 border-slate-200 text-slate-700 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Official Email Address
                </label>
                <div className="relative">
                  <IoMailOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <IoCallOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600 text-base" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    placeholder="+91 98765 43210"
                    className={`w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl border transition ${
                      editingProfile
                        ? "bg-white border-slate-300 focus:border-orange-500 focus:outline-hidden"
                        : "bg-slate-50 border-slate-200 text-slate-700 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Security Badge Card */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3 shadow-xs border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-orange-400">
            <IoShieldCheckmark size={18} />
            <span>Admin Authentication & Protection</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
            Admin sessions are protected with HTTP-only tokens, role-based authorization gates, and encrypted password credentials.
          </p>
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
