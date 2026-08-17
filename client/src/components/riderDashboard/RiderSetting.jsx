// import React, { useState } from "react";
// import {
//   MdEdit,
//   MdOutlineLockReset,
//   MdOutlineAddAPhoto,
// } from "react-icons/md";
// import toast from "react-hot-toast";

// import { useAuth } from "../../context/AuthContext";
// import api from "../../config/api.config.js";
// import PasswordChangeModal from "../commomModals/PasswordChangeModal.jsx";

// const RiderSetting = () => {
//   const { user, setUser } = useAuth();

//   const [editingProfile, setEditingProfile] = useState(false);
//   const [profilePic, setProfilePic] = useState(null);
//   const [profilePicPreview, setProfilePicPreview] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
//     useState(false);

//   const [formData, setFormData] = useState({
//     fullName: user?.fullName || "",
//     email: user?.email || "",
//     phone: user?.phone || "",
//   });

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleProfilePicChange = (e) => {
//     const file = e.target.files[0];

//     if (!file) return;

//     setProfilePic(file);
//     setProfilePicPreview(URL.createObjectURL(file));
//   };

//   const handleSaveProfile = async () => {
//     try {
//       setIsLoading(true);

//       const payload = new FormData();

//       payload.append("fullName", formData.fullName);
//       payload.append("email", formData.email.toLowerCase());
//       payload.append("phone", formData.phone);

//       if (profilePic) {
//         payload.append("displayPic", profilePic);
//       }

//       const response = await api.put("/user/edit-profile", payload);

//       const updatedUser = response.data.data;

//       setUser(updatedUser);

//       sessionStorage.setItem(
//         "cravingUser",
//         JSON.stringify(updatedUser)
//       );

//       setEditingProfile(false);
//       setProfilePic(null);
//       setProfilePicPreview(null);

//       toast.success("Profile updated successfully!");
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Failed to update profile"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancelProfile = () => {
//     setFormData({
//       fullName: user?.fullName || "",
//       email: user?.email || "",
//       phone: user?.phone || "",
//     });

//     setProfilePic(null);
//     setProfilePicPreview(null);
//     setEditingProfile(false);
//   };

//   return (
//   <>
//     <div className="min-h-full overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-200 overflow-hidden">

//         <div className="relative bg-[var(--primary)] px-5 py-8 sm:px-8 sm:py-10">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-white">
//               Rider Profile
//             </h1>
//             <p className="text-sm text-white/70 mt-1">
//               Manage your personal information
//             </p>
//           </div>

//           <div className="mt-5 sm:absolute sm:right-6 sm:top-6 flex flex-wrap gap-3">
//             {!editingProfile ? (
//               <>
//                 <button
//                   onClick={() => setEditingProfile(true)}
//                   className="
//                     flex items-center gap-2
//                     px-4 py-2.5 rounded-xl
//                     bg-[var(--accent)]
//                     text-white
//                     font-medium
//                     hover:opacity-90
//                     transition
//                   "
//                 >
//                   <MdEdit />
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => setIsPasswordChangeModalOpen(true)}
//                   className="
//                     flex items-center gap-2
//                     px-4 py-2.5 rounded-xl
//                     border border-white/40
//                     text-white
//                     hover:bg-white/10
//                     transition
//                   "
//                 >
//                   <MdOutlineLockReset />
//                   Password
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button
//                   onClick={handleCancelProfile}
//                   disabled={isLoading}
//                   className="
//                     px-4 py-2.5 rounded-xl
//                     bg-white/10
//                     text-white
//                     hover:bg-white/20
//                   "
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={handleSaveProfile}
//                   disabled={isLoading}
//                   className="
//                     px-4 py-2.5 rounded-xl
//                     bg-[var(--accent)]
//                     text-white
//                     font-medium
//                   "
//                 >
//                   {isLoading ? "Saving..." : "Save"}
//                 </button>
//               </>
//             )}
//           </div>
//         </div>


//         <div className="p-5 sm:p-8">

//           <div className="flex flex-col md:flex-row gap-8">

//             <div className="flex justify-center md:block">
//               <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white p-1 border shadow-lg">

//                 <img
//                   src={
//                     profilePicPreview ||
//                     user?.photo?.url ||
//                     "https://via.placeholder.com/150"
//                   }
//                   alt="Profile"
//                   className="w-full h-full rounded-full object-cover"
//                 />

//                 {editingProfile && (
//                   <>
//                     <label
//                       htmlFor="profilePic"
//                       className="
//                         absolute bottom-1 right-1
//                         w-10 h-10
//                         rounded-full
//                         bg-[var(--accent)]
//                         text-white
//                         flex items-center justify-center
//                         cursor-pointer
//                       "
//                     >
//                       <MdOutlineAddAPhoto />
//                     </label>

//                     <input
//                       id="profilePic"
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={handleProfilePicChange}
//                     />
//                   </>
//                 )}

//               </div>
//             </div>


//             <div className="flex-1">

//               <h2 className="text-2xl sm:text-3xl font-bold text-[var(--primary)]">
//                 {user?.fullName || "Rider"}
//               </h2>

//               <p className="text-gray-500 mt-1 mb-6">
//                 Update your account information below.
//               </p>


//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//                 <div>
//                   <label className="text-sm font-medium text-gray-700">
//                     Full Name
//                   </label>

//                   <input
//                     type="text"
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleProfileChange}
//                     disabled={!editingProfile}
//                     className="
//                       mt-2 w-full px-4 py-3 rounded-xl
//                       border border-gray-200
//                       bg-gray-50
//                       outline-none
//                       focus:border-[var(--accent)]
//                       disabled:text-gray-500
//                     "
//                   />
//                 </div>


//                 <div>
//                   <label className="text-sm font-medium text-gray-700">
//                     Email
//                   </label>

//                   <input
//                     type="email"
//                     value={formData.email}
//                     disabled
//                     className="
//                       mt-2 w-full px-4 py-3 rounded-xl
//                       border border-gray-200
//                       bg-gray-100
//                       text-gray-500
//                     "
//                   />
//                 </div>


//                 <div className="md:col-span-2">
//                   <label className="text-sm font-medium text-gray-700">
//                     Phone Number
//                   </label>

//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleProfileChange}
//                     disabled={!editingProfile}
//                     className="
//                       mt-2 w-full px-4 py-3 rounded-xl
//                       border border-gray-200
//                       bg-gray-50
//                       outline-none
//                       focus:border-[var(--accent)]
//                       disabled:text-gray-500
//                     "
//                   />
//                 </div>

//               </div>


//               {editingProfile && (
//                 <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">

//                   <button
//                     onClick={handleCancelProfile}
//                     className="
//                       px-6 py-3 rounded-xl
//                       bg-gray-100
//                       text-gray-700
//                     "
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     onClick={handleSaveProfile}
//                     className="
//                       px-6 py-3 rounded-xl
//                       bg-[var(--accent)]
//                       text-white
//                       font-medium
//                     "
//                   >
//                     {isLoading ? "Saving..." : "Save Changes"}
//                   </button>

//                 </div>
//               )}

//             </div>
//           </div>
//         </div>

//       </div>
//     </div>

//     {isPasswordChangeModalOpen && (
//       <PasswordChangeModal
//         open={isPasswordChangeModalOpen}
//         onClose={() => setIsPasswordChangeModalOpen(false)}
//       />
//     )}
//   </>
// );
// };

// export default RiderSetting;




import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import PasswordChangeModal from "../commonModals/PasswordChangeModal";
import Information from "./settings/riderInformation/Index";
import CoreDetails from "./settings/coreDetails/Index";
import RiderPhotos from "./settings/RiderPhotos";

const RiderSetting = () => {
  const Tabs = [
    {
      id: "information",
      label: "Information",
    },
    {
      id: "coreDetails",
      label: "Core Details",
    },
    {
      id: "photos",
      label: "Photos",
    },
  ];

  const { user, setUser } = useAuth();

  const [activeTab, setActiveTab] = useState("information");

  const [editingPhoto, setEditingPhoto] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const [isSavingPhoto, setIsSavingPhoto] = useState(false);

  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);

  /* =====================================================
     PROFILE PHOTO PREVIEW
  ===================================================== */

  const profilePicPreview = useMemo(() => {
    if (!profilePic) return "";

    return URL.createObjectURL(profilePic);
  }, [profilePic]);

  /* =====================================================
     CLEANUP OBJECT URL
  ===================================================== */

  useEffect(() => {
    return () => {
      if (profilePicPreview) {
        URL.revokeObjectURL(profilePicPreview);
      }
    };
  }, [profilePicPreview]);

  /* =====================================================
     SELECT PROFILE PHOTO
  ===================================================== */

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setProfilePic(null);
      return;
    }

    setProfilePic(file);
  };

  /* =====================================================
     CANCEL PHOTO EDIT
  ===================================================== */

  const handleCancelPhoto = () => {
    setProfilePic(null);
    setEditingPhoto(false);
  };

  /* =====================================================
     SAVE PROFILE PHOTO
  ===================================================== */

  const handleSavePhoto = async () => {
    if (!profilePic) {
      toast.error("Please select a profile photo first.");
      return;
    }

    try {
      setIsSavingPhoto(true);

      const payload = new FormData();

      payload.append("displayPic", profilePic);

      const response = await api.put("/common/edit-profile", payload);

      const updatedUser = response.data.data;

      setUser(updatedUser);

      sessionStorage.setItem(
        "cravingUser",
        JSON.stringify(updatedUser)
      );

      toast.success("Profile photo updated successfully!");

      setProfilePic(null);
      setEditingPhoto(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update profile photo"
      );
    } finally {
      setIsSavingPhoto(false);
    }
  };

  return (
    <>
      <div className="h-full flex flex-col">

        {/* =================================================
            TABS
        ================================================= */}

        <div className="border-b border-(--color-secondary)/50 flex justify-between mb-2 w-full">

          <div className="flex gap-3">

            {Tabs.map((tab) => (
              <div
                key={tab.id}
                className={`p-2 uppercase cursor-pointer transition ${activeTab === tab.id
                    ? "text-(--color-primary) border-b-3 border-(--color-primary)"
                    : "text-(--color-base-content) hover:text-(--color-primary)"
                  }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </div>
            ))}

          </div>

        </div>

        {/* =================================================
            TAB CONTENT
        ================================================= */}

        <div className="h-full rounded-lg bg-(--color-base-200) p-2">

          {/* ================= INFORMATION ================= */}

          {activeTab === "information" && (
            <div className="overflow-y-auto h-full p-2 space-y-2">
              <Information />
            </div>
          )}

          {/* ================= CORE DETAILS ================= */}

          {activeTab === "coreDetails" && (
            <div className="overflow-y-auto h-full p-2 space-y-2">

              <CoreDetails
                user={user}
                onOpenPasswordModal={() =>
                  setIsPasswordChangeModalOpen(true)
                }
              />

            </div>
          )}

          {/* ================= PHOTOS ================= */}

          {activeTab === "photos" && (
            <div className="overflow-y-auto h-full p-2 space-y-2">

              <RiderPhotos
                user={user}
                profilePicPreview={profilePicPreview}
                editingPhoto={editingPhoto}
                isSavingPhoto={isSavingPhoto}
                onStartEdit={() => setEditingPhoto(true)}
                onCancel={handleCancelPhoto}
                onSelectPhoto={handleProfilePicChange}
                onSave={handleSavePhoto}
              />

            </div>
          )}

        </div>
      </div>

      {/* =================================================
          PASSWORD CHANGE MODAL
      ================================================= */}

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