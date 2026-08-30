import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { IoStar, IoAdd, IoRemove, IoSparkles } from "react-icons/io5";

import { foodTypeDot } from "./helpers";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const MenuItemCard = ({ item, restaurantId, restaurantName }) => {
  const { isLogin, user, role } = useAuth();
  const { addItem, increaseItem, decreaseItem, getItemQuantity, replaceCart } =
    useCart();
  const [showConflictModal, setShowConflictModal] = useState(false);

  const isCustomer = isLogin && user && (role === "user" || role === "customer");
  const isUnavailable = item.status === "unavailable" || item.status === "discontinued";
  const itemCount = isCustomer ? getItemQuantity(item._id) : 0;

  const handleAdd = () => {
    if (!isLogin || !user) {
      toast.error("Please login to add items to your cart.");
      return;
    }
    if (role !== "user" && role !== "customer") {
      toast.error("Please login as a customer to order food.");
      return;
    }
    if (isUnavailable) return;
    const result = addItem(item, restaurantId, restaurantName);
    if (result === "different_restaurant") {
      setShowConflictModal(true);
    }
  };

  const handleReplaceCart = () => {
    replaceCart(item, restaurantId, restaurantName);
    setShowConflictModal(false);
  };

  const isPureVeg = item.foodType?.toLowerCase() === "vegetarian" || item.foodType?.toLowerCase() === "vegan";

  return (
    <>
      <div
        className={`group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/80 p-4 shadow-xs card-hover transition-all duration-300 ${
          isUnavailable ? "opacity-65 grayscale cursor-not-allowed" : "hover:border-orange-200"
        }`}
      >
        <div className="flex gap-4 items-start">
          {/* Item Image with Badges */}
          <div className="relative h-28 w-28 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
            {item.image?.url ? (
              <img
                src={item.image.url}
                alt={item.itemName}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";
                }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-orange-50/50 text-orange-400">
                <MdOutlineRestaurantMenu size={32} className="opacity-40" />
              </div>
            )}

            {/* Diet Dot */}
            <span
              className={`absolute top-2 left-2 flex h-4 w-4 items-center justify-center rounded-sm border bg-white p-0.5 shadow-xs ${
                isPureVeg ? "border-emerald-600" : "border-red-600"
              }`}
              title={item.foodType}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isPureVeg ? "bg-emerald-600" : "bg-red-600"
                }`}
              />
            </span>

            {/* Unavailable Overlay */}
            {isUnavailable && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full bg-red-600">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="flex-1 min-w-0 space-y-1">
            {/* Tag Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              {item.isTopRated && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-800">
                  <IoStar size={10} /> Top Pick
                </span>
              )}
              {item.isNew && (
                <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[9px] font-extrabold text-blue-700">
                  NEW
                </span>
              )}
              {item.isRecommended && (
                <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-[9px] font-extrabold text-orange-700">
                  Chef Special
                </span>
              )}
            </div>

            <h4 className="font-heading text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition truncate">
              {item.itemName}
            </h4>

            <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
              {item.description || "Delicately prepared with fresh ingredients."}
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span className="font-heading text-base font-black text-slate-900">
                ₹{item.price}
              </span>

              {/* Quantity / Add Button */}
              {isUnavailable ? (
                <span className="text-xs font-bold text-slate-400">Unavailable</span>
              ) : itemCount > 0 ? (
                <div className="flex items-center gap-2 rounded-2xl bg-orange-600 p-1 text-white shadow-md shadow-orange-600/30">
                  <button
                    onClick={() => decreaseItem(item._id)}
                    className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-700/60 hover:bg-orange-700 active:scale-90 transition"
                  >
                    <IoRemove size={16} />
                  </button>
                  <span className="font-heading font-black text-sm px-1 min-w-4 text-center">
                    {itemCount}
                  </span>
                  <button
                    onClick={() => increaseItem(item._id)}
                    className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-700/60 hover:bg-orange-700 active:scale-90 transition"
                  >
                    <IoAdd size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-1 rounded-2xl border-2 border-orange-600 bg-orange-50/50 px-4 py-1.5 text-xs font-black text-orange-600 shadow-xs hover:bg-orange-600 hover:text-white active:scale-95 transition-all duration-200"
                >
                  <IoAdd size={16} />
                  <span>ADD</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Different Restaurant Conflict Modal */}
      {showConflictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-center">
            <span className="text-4xl">🛒</span>
            <h3 className="font-heading text-lg font-black text-slate-900">
              Replace cart items?
            </h3>
            <p className="text-xs text-slate-600">
              Your cart already contains items from a different restaurant. Would you like to reset your cart to add from <strong>{restaurantName}</strong>?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConflictModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Keep Current
              </button>
              <button
                onClick={handleReplaceCart}
                className="flex-1 rounded-xl bg-orange-600 py-2.5 text-xs font-extrabold text-white shadow-md shadow-orange-600/30 hover:bg-orange-500 transition"
              >
                Yes, Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;