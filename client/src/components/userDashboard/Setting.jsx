// import React, { useState } from "react";
// import { MdEdit, MdOutlineAddAPhoto, MdOutlineLockReset } from "react-icons/md";
// import { FaUserCircle } from "react-icons/fa";
// import toast from "react-hot-toast";

// import { useAuth } from "../../context/AuthContext";
// import api from "../../config/api.config.js";
// import PasswordChangeModal from "../commomModals/PasswordChangeModal.jsx";

// const CustomerSetting = () => {
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

//       sessionStorage.setItem("cravingUser", JSON.stringify(updatedUser));

//       toast.success("Profile updated successfully");

//       setEditingProfile(false);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Profile update failed");
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
//     <>
//       <div
//         className="
//       h-full
//       overflow-y-auto
//       p-6
//       bg-gradient-to-br
//       from-orange-50
//       via-white
//       to-red-50
//       "
//       >
//         <div
//           className="
//         max-w-5xl
//         mx-auto
//         bg-white
//         rounded-3xl
//         shadow-2xl
//         overflow-hidden
//         border
//         border-orange-100
//         "
//         >
//           {/* Header Banner */}

//           <div
//             className="
//           h-40
//           bg-gradient-to-r
//           from-orange-500
//           via-red-500
//           to-pink-500
//           relative
//           "
//           >
//             <div
//               className="
//             absolute
//             bottom-5
//             left-8
//             text-white
//             "
//             >
//               <h1
//                 className="
//               text-3xl
//               font-extrabold
//               "
//               >
//                 My Profile
//               </h1>

//               <p>Manage your Cravings account</p>
//             </div>
//           </div>

//           <div className="p-8">
//             {/* Profile top section */}

//             <div
//               className=" flex flex-col
//             md:flex-row
//             justify-between
//             items-center
//             -mt-20
//             mb-10
//             "
//             >
//               {/* Image */}

//               <div className="relative">
//                 <img
//                   src={
//                     profilePicPreview ||
//                     user?.photo?.url ||
//                     "https://via.placeholder.com/150"
//                   }
//                   alt="profile"
//                   className="
//                 w-40
//                 h-40
//                 rounded-full
//                 object-cover
//                 border-8
//                 border-white
//                 shadow-xl
//                 "
//                 />

//                 {editingProfile && (
//                   <label
//                     htmlFor="profilePic"
//                     className="
//                   absolute
//                   bottom-3
//                   right-3
//                   bg-orange-500
//                   text-white
//                   p-3
//                   rounded-full
//                   cursor-pointer
//                   shadow-lg
//                   hover:scale-110
//                   transition
//                   "
//                   >
//                     <MdOutlineAddAPhoto size={22} />

//                     <input
//                       id="profilePic"
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={handleProfilePicChange}
//                     />
//                   </label>
//                 )}
//               </div>

//               {/* Buttons */}

//               <div
//                 className="
//               flex
//               gap-3
//               mt-6
//               md:mt-20
//               "
//               >
//                 {!editingProfile ? (
//                   <>
//                     <button
//                       onClick={() => setEditingProfile(true)}
//                       className="
//               flex
//               items-center
//               gap-2
//               px-6
//               py-3
//               rounded-2xl
//               bg-gradient-to-r
//               from-orange-500
//               to-red-500
//               text-white
//               font-bold
//               shadow-lg
//               hover:scale-105
//               transition
//               "
//                     >
//                       <MdEdit />
//                       Edit Profile
//                     </button>

//                     <button
//                       onClick={() => setIsPasswordChangeModalOpen(true)}
//                       className="
//               flex
//               items-center
//               gap-2
//               px-6
//               py-3
//               rounded-2xl
//               border-2
//               border-orange-500
//               text-orange-600
//               font-bold
//               hover:bg-orange-500
//               hover:text-white
//               transition
//               "
//                     >
//                       <MdOutlineLockReset />
//                       Password
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <button
//                       onClick={handleSaveProfile}
//                       disabled={isLoading}
//                       className="
//               px-6
//               py-3
//               rounded-2xl
//               bg-green-500
//               text-white
//               font-bold
//               "
//                     >
//                       {isLoading ? "Saving..." : "Save"}
//                     </button>

//                     <button
//                       onClick={handleCancelProfile}
//                       className="
//               px-6
//               py-3
//               rounded-2xl
//               bg-gray-200
//               font-bold
//               "
//                     >
//                       Cancel
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Form Cards */}

//             <div
//               className="
//             grid
//             md:grid-cols-2
//             gap-6
//             "
//             >
//               {[
//                 {
//                   label: "Full Name",
//                   name: "fullName",
//                   type: "text",
//                 },

//                 {
//                   label: "Email Address",
//                   name: "email",
//                   type: "email",
//                 },

//                 {
//                   label: "Phone Number",
//                   name: "phone",
//                   type: "tel",
//                 },
//               ].map((item) => (
//                 <div
//                   key={item.name}
//                   className="
//             bg-orange-50
//             p-5
//             rounded-2xl
//             border
//             border-orange-100
//             "
//                 >
//                   <label
//                     className="
//                 text-orange-700
//                 font-bold
//                 text-sm
//                 "
//                   >
//                     {item.label}
//                   </label>

//                   <input
//                     type={item.type}
//                     name={item.name}
//                     value={formData[item.name]}
//                     disabled={item.name === "email" || !editingProfile}
//                     onChange={handleProfileChange}
//                     className="
//                 mt-3
//                 w-full
//                 px-4
//                 py-3
//                 bg-white
//                 rounded-xl
//                 border
//                 border-orange-200
//                 outline-none
//                 focus:ring-2
//                 focus:ring-orange-400
//                 "
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {isPasswordChangeModalOpen && (
//         <PasswordChangeModal
//           open={isPasswordChangeModalOpen}
//           onClose={() => setIsPasswordChangeModalOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default CustomerSetting;


import React, { useState } from "react";
import { MdEdit, MdOutlineAddAPhoto, MdOutlineLockReset } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config.js";
import PasswordChangeModal from "../commomModals/PasswordChangeModal.jsx";

const CustomerSetting = () => {
  const { user, setUser } = useAuth();

  const [editingProfile, setEditingProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);

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
      sessionStorage.setItem("cravingUser", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully");
      setEditingProfile(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
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

  const fields = [
    { label: "Full Name", name: "fullName", type: "text" },
    { label: "Email Address", name: "email", type: "email" },
    { label: "Phone Number", name: "phone", type: "tel" },
  ];

  return (
    <>
      <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
          {/* Header */}
          <div className="h-40 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 relative">
            <div className="absolute bottom-5 left-8 text-white">
              <h1 className="text-3xl font-extrabold">My Profile</h1>
              <p>Manage your Cravings account</p>
            </div>
          </div>

          <div className="p-8">
            {/* Profile */}
            <div className="flex flex-col md:flex-row justify-between items-center -mt-20 mb-10">
              <div className="relative">
                <img
                  src={
                    profilePicPreview ||
                    user?.photo?.url ||
                    "https://via.placeholder.com/150"
                  }
                  alt="profile"
                  className="w-40 h-40 rounded-full object-cover border-8 border-white shadow-xl"
                />

                {editingProfile && (
                  <label
                    htmlFor="profilePic"
                    className="absolute bottom-3 right-3 bg-orange-500 text-white p-3 rounded-full cursor-pointer shadow-lg hover:scale-110 transition"
                  >
                    <MdOutlineAddAPhoto size={22} />

                    <input
                      id="profilePic"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePicChange}
                    />
                  </label>
                )}
              </div>

              <div className="flex gap-3 mt-6 md:mt-20">
                {!editingProfile ? (
                  <>
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg hover:scale-105 transition"
                    >
                      <MdEdit />
                      Edit Profile
                    </button>

                    <button
                      onClick={() => setIsPasswordChangeModalOpen(true)}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-orange-500 text-orange-600 font-bold hover:bg-orange-500 hover:text-white transition"
                    >
                      <MdOutlineLockReset />
                      Password
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="px-6 py-3 rounded-2xl bg-green-500 text-white font-bold"
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>

                    <button
                      onClick={handleCancelProfile}
                      className="px-6 py-3 rounded-2xl bg-gray-200 font-bold"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="grid md:grid-cols-2 gap-6">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className="bg-orange-50 p-5 rounded-2xl border border-orange-100"
                >
                  <label className="text-orange-700 font-bold text-sm">
                    {field.label}
                  </label>

                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    disabled={field.name === "email" || !editingProfile}
                    onChange={handleProfileChange}
                    className="mt-3 w-full px-4 py-3 bg-white rounded-xl border border-orange-200 outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              ))}
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