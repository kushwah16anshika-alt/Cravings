import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { LuTrash2, LuAward, LuThumbsUp, LuSparkles } from "react-icons/lu";

const ConfirmModal = ({
  selectedItem,
  modalMode,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const modalData = {
    delete: {
      icon: <LuTrash2 className="text-red-500" size={42} />,
      title: "Delete Menu Item",
      message: `Are you sure you want to delete "${selectedItem?.itemName}"? This action cannot be undone.`,
      button: "Delete",
      buttonClass: "bg-red-500 hover:bg-red-600",
    },
    topRated: {
      icon: <LuAward className="text-(--color-primary)" size={42} />,
      title: "Top Rated Item",
      message: `Update Top Rated status for "${selectedItem?.itemName}"?`,
      button: "Confirm",
      buttonClass: "bg-(--color-primary) hover:opacity-90",
    },
    recommended: {
      icon: <LuThumbsUp className="text-(--color-primary)" size={42} />,
      title: "Recommended Item",
      message: `Update Recommended status for "${selectedItem?.itemName}"?`,
      button: "Confirm",
      buttonClass: "bg-(--color-primary) hover:opacity-90",
    },
    new: {
      icon: <LuSparkles className="text-(--color-primary)" size={42} />,
      title: "New Item",
      message: `Update New Item status for "${selectedItem?.itemName}"?`,
      button: "Confirm",
      buttonClass: "bg-(--color-primary) hover:opacity-90",
    },
  };

  const current = modalData[modalMode];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-secondary)">
          <h2 className="text-xl font-bold text-(--color-primary)">
            {current.title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <IoMdCloseCircleOutline size={28} />
          </button>
        </div>

        <div className="px-6 py-8 text-center">
          <div className="flex justify-center mb-5">
            {current.icon}
          </div>

          <p className="text-gray-600 leading-7">
            {current.message}
          </p>
        </div>

        <div className="flex justify-end gap-3 px-6 py-5 border-t border-(--color-secondary)">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-lg text-white transition ${current.buttonClass}`}
          >
            {current.button}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;