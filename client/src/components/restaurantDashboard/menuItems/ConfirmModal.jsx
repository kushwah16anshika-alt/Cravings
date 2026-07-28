// import React from "react";
// import { IoMdCloseCircleOutline } from "react-icons/io";
// import { LuTrash2, LuAward, LuThumbsUp, LuSparkles } from "react-icons/lu";

// const ConfirmModal = ({
//   selectedItem,
//   modalMode,
//   isOpen,
//   onClose,
//   onConfirm,
// }) => {
//   if (!isOpen) return null;

//   const modalData = {
//     delete: {
//       icon: <LuTrash2 className="text-red-500" size={42} />,
//       title: "Delete Menu Item",
//       message: `Are you sure you want to delete "${selectedItem?.itemName}"? This action cannot be undone.`,
//       button: "Delete",
//       buttonClass: "bg-red-500 hover:bg-red-600",
//     },
//     topRated: {
//       icon: <LuAward className="text-(--color-primary)" size={42} />,
//       title: "Top Rated Item",
//       message: `Update Top Rated status for "${selectedItem?.itemName}"?`,
//       button: "Confirm",
//       buttonClass: "bg-(--color-primary) hover:opacity-90",
//     },
//     recommended: {
//       icon: <LuThumbsUp className="text-(--color-primary)" size={42} />,
//       title: "Recommended Item",
//       message: `Update Recommended status for "${selectedItem?.itemName}"?`,
//       button: "Confirm",
//       buttonClass: "bg-(--color-primary) hover:opacity-90",
//     },
//     new: {
//       icon: <LuSparkles className="text-(--color-primary)" size={42} />,
//       title: "New Item",
//       message: `Update New Item status for "${selectedItem?.itemName}"?`,
//       button: "Confirm",
//       buttonClass: "bg-(--color-primary) hover:opacity-90",
//     },
//   };

//   const current = modalData[modalMode];

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
//       <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
//         <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-secondary)">
//           <h2 className="text-xl font-bold text-(--color-primary)">
//             {current.title}
//           </h2>

//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-red-500 transition"
//           >
//             <IoMdCloseCircleOutline size={28} />
//           </button>
//         </div>

//         <div className="px-6 py-8 text-center">
//           <div className="flex justify-center mb-5">
//             {current.icon}
//           </div>

//           <p className="text-gray-600 leading-7">
//             {current.message}
//           </p>
//         </div>

//         <div className="flex justify-end gap-3 px-6 py-5 border-t border-(--color-secondary)">
//           <button
//             onClick={onClose}
//             className="px-5 py-2 rounded-lg border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={onConfirm}
//             className={`px-5 py-2 rounded-lg text-white transition ${current.buttonClass}`}
//           >
//             {current.button}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmModal;


import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import api from "../../../config/api.config";

const modalConfig = {
  delete: {
    heading: "Confirm Deletion",
    description: "This will remove the item from your active menu.",
    confirmLabel: "Delete Item",
    confirmClass: "bg-red-600 hover:bg-red-700 text-white",
  },

  topRated: {
    heading: "Change Top Rated",
    description: "Toggle this item's top-rated badge.",
    confirmLabel: "Confirm",
    confirmClass:
      "bg-(--color-primary) hover:opacity-90 text-(--color-primary-content)",
  },

  recommended: {
    heading: "Change Recommendation",
    description: "Toggle this item's recommended badge.",
    confirmLabel: "Confirm",
    confirmClass:
      "bg-(--color-primary) hover:opacity-90 text-(--color-primary-content)",
  },

  new: {
    heading: "Change New Badge",
    description: "Toggle this item's new badge.",
    confirmLabel: "Confirm",
    confirmClass:
      "bg-(--color-primary) hover:opacity-90 text-(--color-primary-content)",
  },
};

const ConfirmModal = ({
  selectedItem,
  modalMode,
  isOpen,
  onClose,
  refreshMenu,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const currentConfig = modalConfig[modalMode] || {
    heading: "Are you sure?",
    description: "Please confirm this action.",
    confirmLabel: "Confirm",
    confirmClass:
      "bg-(--color-primary) hover:opacity-90 text-(--color-primary-content)",
  };

  const handleConfirm = async () => {
    if (!selectedItem?._id) {
      toast.error("Invalid item selected.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (modalMode === "delete") {
        const response = await api.delete(
          `/menu/delete/${selectedItem._id}`
        );

        toast.success(
          response.data.message || "Item deleted successfully"
        );
      } else {
        const controlMap = {
          topRated: "isTopRated",
          recommended: "isRecommended",
          new: "isNew",
        };

        const control = controlMap[modalMode];

        const response = await api.patch(
          `/menu/control/${selectedItem._id}`,
          {
            control,
          }
        );

        toast.success(
          response.data.message || "Item updated successfully"
        );
      }

      if (refreshMenu) {
        await refreshMenu();
      }

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to complete this action. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">

          <div className="flex justify-between items-center border-b border-(--color-secondary) pb-2 mb-4">

            <h1 className="text-xl text-(--color-primary) font-semibold">
              Are you sure?
            </h1>

            <button
              className="text-red-300 hover:text-red-500"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <IoMdCloseCircleOutline size={24} />
            </button>

          </div>

          <div className="space-y-2">

            <h2 className="text-lg font-semibold text-(--color-primary)">
              {currentConfig.heading}
            </h2>

            <p className="text-sm text-gray-600">
              {currentConfig.description}
            </p>

            <p className="text-sm">
              Item:{" "}
              <span className="font-semibold">
                {selectedItem?.itemName}
              </span>
            </p>

          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-(--color-secondary) pt-3">

            <button
              className="bg-(--color-secondary) disabled:bg-(--color-secondary)/60 text-(--color-secondary-content) px-4 py-2 rounded"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              className={`px-4 py-2 rounded disabled:opacity-60 ${currentConfig.confirmClass}`}
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Please wait..."
                : currentConfig.confirmLabel}
            </button>

          </div>

        </div>
      </div>
    </>
  );
};

export default ConfirmModal;