import React from "react";
import LiveOrderTrackerWrapped from "./LiveOrderTracker";
import { IoClose } from "react-icons/io5";

export const OrderTrackingModal = ({
  isOpen,
  onClose,
  orderId,
  initialOrderData = null,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-orange-500 animate-pulse" />
            <h3 className="font-heading text-base font-black text-slate-900">
              Live Order Map & GPS Tracker
            </h3>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition active:scale-95"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <LiveOrderTrackerWrapped
            orderId={orderId}
            initialOrderData={initialOrderData}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
