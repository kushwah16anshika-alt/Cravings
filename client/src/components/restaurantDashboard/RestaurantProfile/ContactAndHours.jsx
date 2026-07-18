import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../config/api.config.js";
import runningLoader from "../../../assets/runningLoader.gif";

const ContactAndHours = ({ initialData, onSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    contactEmail: initialData?.contactDetails?.email || "",
    contactPhone: initialData?.contactDetails?.phone || "",
    openingTime: initialData?.servingHours?.openingTime || "",
    closingTime: initialData?.servingHours?.closingTime || "",
    facebookUrl:
      initialData?.socialMediaLinks?.find(
        (item) => item.platform === "facebook",
      )?.url || "",
    instagramUrl:
      initialData?.socialMediaLinks?.find(
        (item) => item.platform === "instagram",
      )?.url || "",
    twitterUrl:
      initialData?.socialMediaLinks?.find((item) => item.platform === "twitter")
        ?.url || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setFormData({
      contactEmail: initialData?.contactDetails?.email || "",
      contactPhone: initialData?.contactDetails?.phone || "",
      openingTime: initialData?.servingHours?.openingTime || "",
      closingTime: initialData?.servingHours?.closingTime || "",
      facebookUrl:
        initialData?.socialMediaLinks?.find(
          (item) => item.platform === "facebook",
        )?.url || "",
      instagramUrl:
        initialData?.socialMediaLinks?.find(
          (item) => item.platform === "instagram",
        )?.url || "",
      twitterUrl:
        initialData?.socialMediaLinks?.find(
          (item) => item.platform === "twitter",
        )?.url || "",
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const payload = new FormData();

      payload.append("contactDetails.email", formData.contactEmail);
      payload.append("contactDetails.phone", formData.contactPhone);
      payload.append("servingHours.openingTime", formData.openingTime);
      payload.append("servingHours.closingTime", formData.closingTime);

      const socialMediaLinks = [];

      if (formData.facebookUrl) {
        socialMediaLinks.push({
          platform: "facebook",
          url: formData.facebookUrl,
        });
      }

      if (formData.instagramUrl) {
        socialMediaLinks.push({
          platform: "instagram",
          url: formData.instagramUrl,
        });
      }

      if (formData.twitterUrl) {
        socialMediaLinks.push({
          platform: "twitter",
          url: formData.twitterUrl,
        });
      }

      payload.append("socialMediaLinks", JSON.stringify(socialMediaLinks));

      const response = await api.post("/restaurant/update-profile", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message || "Contact updated successfully!");

      setIsEditing(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to update contact details",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-(--color-base-100) p-6 rounded-2xl shadow-md border border-(--color-base-300)"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold border-b-2 border-(--color-primary) pb-2">
          Contact & Hours
        </h3>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-(--color-primary) text-(--color-primary-content) px-5 py-2 rounded-lg"
          >
            Edit Profile
          </button>
        )}
      </div>

      <fieldset disabled={!isEditing}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Contact Phone</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Opening Time</label>
            <input
              type="time"
              name="openingTime"
              value={formData.openingTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Closing Time</label>
            <input
              type="time"
              name="closingTime"
              value={formData.closingTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>

        <h4 className="font-bold mt-6 mb-4">Social Media Links</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="url"
            name="facebookUrl"
            value={formData.facebookUrl}
            onChange={handleChange}
            placeholder="Facebook URL"
            className="px-3 py-2 border rounded"
          />

          <input
            type="url"
            name="instagramUrl"
            value={formData.instagramUrl}
            onChange={handleChange}
            placeholder="Instagram URL"
            className="px-3 py-2 border rounded"
          />

          <input
            type="url"
            name="twitterUrl"
            value={formData.twitterUrl}
            onChange={handleChange}
            placeholder="Twitter URL"
            className="px-3 py-2 border rounded"
          />
        </div>
      </fieldset>

      {isEditing && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-(--color-primary) text-(--color-primary-content) px-4 py-2 rounded flex items-center gap-2"
          >
            {isLoading && <img src={runningLoader} className="w-5 h-5" />}
            Save Contact & Hours
          </button>
        </div>
      )}
    </form>
  );
};

export default ContactAndHours;
