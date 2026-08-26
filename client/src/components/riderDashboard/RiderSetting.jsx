

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import PasswordChangeModal from "../../components/commomModals/PasswordChangeModal.jsx";
import Information from "./RiderProfile/riderInformation/Index.jsx";
import CoreDetails from "./RiderProfile/coreDetails/Index.jsx";
import RiderPhotos from "./RiderProfile/RiderPhotos.jsx";

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