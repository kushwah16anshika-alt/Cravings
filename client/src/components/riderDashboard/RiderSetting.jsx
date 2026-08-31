import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import PasswordChangeModal from "../commomModals/PasswordChangeModal.jsx";
import { MdOutlineAddAPhoto, MdOutlineLockReset } from "react-icons/md";
import { RiLoader4Fill } from "react-icons/ri";

const RiderSetting = () => {
  const { user, setUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "male",
    address: user?.address || "",
    city: user?.city || "Bhopal",
    state: user?.state || "Madhya Pradesh",
    pincode: user?.pincode || "462001",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "male",
        address: user.address || "",
        city: user.city || "Bhopal",
        state: user.state || "Madhya Pradesh",
        pincode: user.pincode || "462001",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "male",
        address: user.address || "",
        city: user.city || "Bhopal",
        state: user.state || "Madhya Pradesh",
        pincode: user.pincode || "462001",
      });
    }
    setProfilePic(null);
    setProfilePicPreview(null);
    setEditingProfile(false);
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    try {
      setIsLoading(true);

      const payload = new FormData();
      payload.append("fullName", formData.fullName.trim());
      payload.append("email", formData.email.toLowerCase().trim());
      payload.append("phone", formData.phone.trim());
      if (formData.gender) payload.append("gender", formData.gender);
      if (formData.address) payload.append("address", formData.address.trim());
      if (formData.city) payload.append("city", formData.city.trim());
      if (formData.state) payload.append("state", formData.state.trim());
      if (formData.pincode) payload.append("pincode", formData.pincode.trim());

      if (profilePic) {
        payload.append("displayPic", profilePic);
      }

      const response = await api.put("/common/edit-profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = response.data.data;
      setUser(updatedUser);
      sessionStorage.setItem("cravingUser", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully");
      setEditingProfile(false);
      setProfilePic(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultAvatar =
    "https://res.cloudinary.com/dpl3xwf1z/image/upload/v1783776802/circleLogo_z7icie.png";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80">
        <div>
          <h1 className="font-heading text-xl font-bold text-slate-900">
            Account Settings
          </h1>
          <p className="text-xs text-slate-500">
            Manage your personal profile and account credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!editingProfile ? (
            <>
              <button
                onClick={() => setEditingProfile(true)}
                className="px-3.5 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setIsPasswordChangeModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-1"
              >
                <MdOutlineLockReset size={14} />
                <span>Password</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition disabled:opacity-50 flex items-center gap-1"
              >
                {isLoading && <RiLoader4Fill className="animate-spin" />}
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Profile Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="relative">
              <img
                src={profilePicPreview || user?.photo?.url || defaultAvatar}
                alt={formData.fullName}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />

              {editingProfile && (
                <label
                  htmlFor="riderPhotoUpload"
                  className="absolute -bottom-1 -right-1 p-1.5 bg-slate-900 text-white rounded-lg cursor-pointer hover:bg-slate-800 transition"
                  title="Change photo"
                >
                  <MdOutlineAddAPhoto size={12} />
                  <input
                    type="file"
                    id="riderPhotoUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                </label>
              )}
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {formData.fullName || "Partner"}
              </h2>
              <p className="text-xs text-slate-500">{formData.email}</p>
              <span className="text-[11px] text-slate-400">
                Delivery Partner
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!editingProfile}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium disabled:bg-slate-50 disabled:text-slate-500 focus:border-orange-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editingProfile}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium disabled:bg-slate-50 disabled:text-slate-500 focus:border-orange-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!editingProfile}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium disabled:bg-slate-50 disabled:text-slate-500 focus:border-orange-500 focus:outline-hidden"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!editingProfile}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium disabled:bg-slate-50 disabled:text-slate-500 focus:border-orange-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                State & Pincode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!editingProfile}
                  className="w-full px-2.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium disabled:bg-slate-50 disabled:text-slate-500 focus:border-orange-500 focus:outline-hidden"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  disabled={!editingProfile}
                  className="w-full px-2.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium disabled:bg-slate-50 disabled:text-slate-500 focus:border-orange-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Block 4, Campus Wing"
                value={formData.address}
                onChange={handleChange}
                disabled={!editingProfile}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium disabled:bg-slate-50 disabled:text-slate-500 focus:border-orange-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Password Modal */}
      {isPasswordChangeModalOpen && (
        <PasswordChangeModal
          open={isPasswordChangeModalOpen}
          onClose={() => setIsPasswordChangeModalOpen(false)}
        />
      )}
    </div>
  );
};

export default RiderSetting;