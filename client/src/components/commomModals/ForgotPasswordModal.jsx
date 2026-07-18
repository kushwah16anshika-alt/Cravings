import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuLoaderCircle } from "react-icons/lu";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";

const ForgotPasswordModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleCloseModal = () => {
    setFormData({
      email: "",
      otp: "",
      newPassword: "",
      confirmNewPassword: "",
    });

    setIsOtpSent(false);
    setIsOtpVerified(false);

    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = async () => {
    try {
      if (!formData.email) {
        toast.error("Email is required");
        return;
      }

      setIsLoading(true);

      // Send OTP

      if (!isOtpSent) {
        const res = await api.post("/auth/send-otp", {
          email: formData.email,
        });

        toast.success(res.data.message);

        setIsOtpSent(true);

        return;
      }

      // Verify OTP

      if (isOtpSent && !isOtpVerified) {
        const res = await api.post("/auth/verify-otp", formData);

        toast.success(res.data.message);

        setIsOtpVerified(true);

        return;
      }

      // Reset Password

      if (isOtpSent && isOtpVerified) {
        if (formData.newPassword !== formData.confirmNewPassword) {
          toast.error("Password does not match");

          return;
        }

        const res = await api.post("/auth/reset-password", formData);

        toast.success(res.data.message);

        handleCloseModal();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-999 bg-black/60 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white w-full max-w-xl rounded shadow max-h-[80vh] overflow-y-auto">
        {/* Header */}

        <header className="flex justify-between items-center p-4 border-b border-(--color-secondary)">
          <div className="font-bold text-xl text-(--color-primary)">
            Forgot Password
          </div>

          <button onClick={handleCloseModal}>
            <IoIosCloseCircleOutline className="text-red-400 hover:text-red-700 text-2xl" />
          </button>
        </header>

        {/* Body */}

        <main>
          <div className="p-6 space-y-4">
            {/* Email */}

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-semibold">
                Registered Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading || isOtpSent}
                className="border border-(--color-secondary) rounded px-3 py-2 disabled:bg-(--color-secondary) disabled:text-(--color-secondary-content)"
              />
            </div>

            {/* OTP */}

            {isOtpSent && (
              <div className="flex flex-col gap-2">
                <label htmlFor="otp" className="font-semibold">
                  Enter OTP
                </label>

                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  disabled={isLoading || isOtpVerified}
                  className="border border-(--color-secondary) rounded px-3 py-2 disabled:bg-(--color-secondary) disabled:text-(--color-secondary-content)"
                />
              </div>
            )}

            {/* New Password */}

            {isOtpSent && isOtpVerified && (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="newPassword" className="font-semibold">
                    New Password
                  </label>

                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border border-(--color-secondary) rounded px-3 py-2 disabled:bg-(--color-secondary) disabled:text-(--color-secondary-content)"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="confirmNewPassword" className="font-semibold">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border border-(--color-secondary) rounded px-3 py-2 disabled:bg-(--color-secondary) disabled:text-(--color-secondary-content)"
                  />
                </div>
              </>
            )}
          </div>
        </main>

        {/* Footer */}

        <footer className="w-full p-4 border-t border-(--color-secondary) flex justify-end gap-3">
          <button
            onClick={handleCloseModal}
            disabled={isLoading}
            className="flex items-center gap-2 bg-(--color-secondary) text-(--color-secondary-content) px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleResetPassword}
            disabled={isLoading}
            className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-3 py-1 rounded text-sm"
          >
            {isLoading ? (
              <>
                <LuLoaderCircle className="animate-spin" />
                Loading...
              </>
            ) : !isOtpSent ? (
              "Send OTP"
            ) : !isOtpVerified ? (
              "Verify OTP"
            ) : (
              "Reset Password"
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
