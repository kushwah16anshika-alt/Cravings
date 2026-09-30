import React, { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import {
  IoClose,
  IoStar,
  IoAdd,
  IoRemove,
  IoSparkles,
  IoCheckmarkCircle,
  IoRestaurantOutline,
  IoFlameOutline,
} from "react-icons/io5";
import { MdOutlineFastfood, MdNotes } from "react-icons/md";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const QUICK_NOTES = [
  "Less spicy",
  "Extra crispy",
  "No onion & garlic",
  "Less oil",
  "Sauce on the side",
  "Pack eco cutlery",
  "Extra napkins",
];

const CustomizeMealModal = ({
  isOpen,
  onClose,
  item,
  restaurantId,
  restaurantName,
}) => {
  const { addItem } = useCart();
  const { isLogin, user, role } = useAuth();

  // Customization options from item or smart defaults
  const options = useMemo(() => {
    const defaultSizes = [
      { name: "Regular Portion", priceExtra: 0 },
      { name: "Large / Sharing", priceExtra: Math.round((item?.price || 200) * 0.35) },
    ];
    const defaultSpice = ["Mild", "Medium", "Spicy 🌶️", "Extra Hot 🌶️🌶️"];
    const defaultSauces = [
      { name: "House Mint Dip", price: 20 },
      { name: "Spicy Chipotle Sauce", price: 25 },
      { name: "Garlic Mayo", price: 20 },
    ];

    const raw = item?.customizationOptions || {};
    return {
      sizes: raw.sizes?.length ? raw.sizes : defaultSizes,
      crustsOrBases: raw.crustsOrBases || [],
      spiceLevels: raw.spiceLevels?.length ? raw.spiceLevels : defaultSpice,
      addOns: raw.addOns || [],
      saucesOrDips: raw.saucesOrDips?.length ? raw.saucesOrDips : defaultSauces,
    };
  }, [item]);

  // States
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSpice, setSelectedSpice] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [selectedSauces, setSelectedSauces] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Initialize defaults on open
  useEffect(() => {
    if (isOpen && item) {
      setSelectedSize(options.sizes[0] || null);
      setSelectedBase(options.crustsOrBases[0] || null);
      setSelectedSpice(options.spiceLevels[1] || options.spiceLevels[0] || "Medium");
      setSelectedAddOns([]);
      setSelectedSauces([]);
      setSpecialInstructions("");
      setQuantity(1);
    }
  }, [isOpen, item, options]);

  // Compute live price
  const basePrice = Number(item?.price) || 0;
  const sizeExtra = Number(selectedSize?.priceExtra) || 0;
  const baseExtra = Number(selectedBase?.priceExtra) || 0;
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  const saucesTotal = selectedSauces.reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  const unitCustomizationExtra = sizeExtra + baseExtra + addOnsTotal + saucesTotal;
  const singleUnitPrice = basePrice + unitCustomizationExtra;
  const totalItemPrice = singleUnitPrice * quantity;

  if (!isOpen || !item) return null;

  const handleToggleAddOn = (addon) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.name === addon.name);
      if (exists) {
        return prev.filter((a) => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleToggleSauce = (sauce) => {
    setSelectedSauces((prev) => {
      const exists = prev.some((s) => s.name === sauce.name);
      if (exists) {
        return prev.filter((s) => s.name !== sauce.name);
      } else {
        return [...prev, sauce];
      }
    });
  };

  const handleAddQuickNote = (note) => {
    setSpecialInstructions((prev) => {
      if (!prev.trim()) return note;
      if (prev.includes(note)) return prev;
      return `${prev}, ${note}`;
    });
  };

  const handleAddToCart = () => {
    if (!isLogin || !user) {
      toast.error("Please login to customize and add items to your cart.");
      return;
    }
    if (role !== "user" && role !== "customer") {
      toast.error("Please login as a customer to order food.");
      return;
    }

    const customizationPayload = {
      isCustomized: true,
      size: selectedSize?.name || "",
      sizeExtra,
      baseOrCrust: selectedBase?.name || "",
      baseExtra,
      spiceLevel: selectedSpice,
      selectedAddOns,
      selectedSauces,
      specialInstructions: specialInstructions.trim(),
      customizationPrice: unitCustomizationExtra,
    };

    const res = addItem(
      item,
      restaurantId,
      restaurantName,
      customizationPayload,
      quantity
    );

    if (res === "different_restaurant") {
      toast.error(
        `Your cart already has items from another restaurant. Please checkout or empty cart first.`
      );
      return;
    }

    toast.success(`✨ Added customized "${item.itemName}" to cart!`);
    onClose();
  };

  const isPureVeg =
    item.foodType?.toLowerCase() === "vegetarian" ||
    item.foodType?.toLowerCase() === "vegan";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden">
        {/* Top Header with Image & Title */}
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white p-5 sm:p-6 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs transition active:scale-90"
          >
            <IoClose size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden bg-white/20 border-2 border-white/40 shadow-md">
              {item.image?.url ? (
                <img
                  src={item.image.url}
                  alt={item.itemName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-white/80">
                  <MdOutlineFastfood size={28} />
                </div>
              )}
              <span
                className={`absolute top-1.5 left-1.5 flex h-4 w-4 items-center justify-center rounded-sm bg-white p-0.5 shadow-xs ${
                  isPureVeg ? "border border-emerald-600" : "border border-red-600"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isPureVeg ? "bg-emerald-600" : "bg-red-600"
                  }`}
                />
              </span>
            </div>

            <div className="min-w-0 pr-6">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider mb-1 backdrop-blur-xs">
                <IoSparkles size={11} />
                <span>Customize Your Dish</span>
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-black text-white truncate">
                {item.itemName}
              </h3>
              <p className="text-xs text-orange-100 font-semibold line-clamp-1">
                Base price: ₹{basePrice} • {item.category || "Main Dish"}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Customization Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 divide-y divide-slate-100 text-slate-800">
          {/* 1. Size / Portion Selection */}
          {options.sizes.length > 0 && (
            <div className="space-y-3 pt-2 first:pt-0">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-100 text-orange-700 text-[10px] font-bold">1</span>
                  <span>Choose Portion / Size</span>
                </h4>
                <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                  Required
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {options.sizes.map((sizeOption, idx) => {
                  const isSelected = selectedSize?.name === sizeOption.name;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSize(sizeOption)}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "border-orange-500 bg-orange-50/70 shadow-xs ring-2 ring-orange-500/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-orange-600 bg-orange-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          {sizeOption.name}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900">
                        {sizeOption.priceExtra > 0
                          ? `+₹${sizeOption.priceExtra}`
                          : "Free"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Base / Crust / Bread / Rice Selection (If present) */}
          {options.crustsOrBases.length > 0 && (
            <div className="space-y-3 pt-5">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-100 text-orange-700 text-[10px] font-bold">2</span>
                  <span>Choice of Crust / Base / Bread</span>
                </h4>
                <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                  Select 1
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {options.crustsOrBases.map((baseOption, idx) => {
                  const isSelected = selectedBase?.name === baseOption.name;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedBase(baseOption)}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "border-orange-500 bg-orange-50/70 shadow-xs ring-2 ring-orange-500/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-orange-600 bg-orange-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          {baseOption.name}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900">
                        {baseOption.priceExtra > 0
                          ? `+₹${baseOption.priceExtra}`
                          : "Free"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Spice Level Slider / Buttons */}
          {options.spiceLevels.length > 0 && (
            <div className="space-y-3 pt-5">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <IoFlameOutline className="text-orange-600 text-sm" />
                  <span>Spice Level Preference</span>
                </h4>
                <span className="text-xs font-bold text-slate-500">
                  {selectedSpice}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {options.spiceLevels.map((lvl, idx) => {
                  const isSelected = selectedSpice === lvl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSpice(lvl)}
                      className={`py-2.5 px-3 rounded-xl border text-center text-xs font-extrabold transition-all ${
                        isSelected
                          ? "border-orange-600 bg-orange-600 text-white shadow-xs scale-[1.02]"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-orange-300"
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Add-Ons & Extras (Multi-select) */}
          {options.addOns.length > 0 && (
            <div className="space-y-3 pt-5">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold">✨</span>
                  <span>Add-Ons & Extras (Optional)</span>
                </h4>
                <span className="text-[11px] font-bold text-slate-400">
                  Select any
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {options.addOns.map((addon, idx) => {
                  const isChecked = selectedAddOns.some((a) => a.name === addon.name);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleAddOn(addon)}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        isChecked
                          ? "border-amber-500 bg-amber-50/60 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-4 w-4 rounded-md border flex items-center justify-center transition ${
                            isChecked
                              ? "border-amber-600 bg-amber-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <IoCheckmarkCircle size={14} />}
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-amber-700">
                        +₹{addon.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Gourmet Sauces & Dips (Optional) */}
          {options.saucesOrDips.length > 0 && (
            <div className="space-y-3 pt-5">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">🥣</span>
                  <span>Extra Dips & Sauces</span>
                </h4>
                <span className="text-[11px] font-bold text-slate-400">
                  Optional
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {options.saucesOrDips.map((sauce, idx) => {
                  const isChecked = selectedSauces.some((s) => s.name === sauce.name);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleSauce(sauce)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between gap-1 transition ${
                        isChecked
                          ? "border-emerald-500 bg-emerald-50/60 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {sauce.name}
                      </span>
                      <span className="text-[11px] font-extrabold text-emerald-700">
                        +₹{sauce.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. Special Cooking Instructions */}
          <div className="space-y-3 pt-5">
            <div className="flex items-center justify-between">
              <h4 className="font-heading text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <MdNotes className="text-orange-600 text-sm" />
                <span>Special Instructions for Kitchen</span>
              </h4>
            </div>

            {/* Quick click tags */}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_NOTES.map((qn, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddQuickNote(qn)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-800 transition"
                >
                  +{qn}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Please make it extra hot, crisp the crust, no mayo on side..."
              className="w-full text-xs font-medium p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white transition resize-none"
            />
          </div>
        </div>

        {/* Bottom Sticky Action & Price Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex items-center justify-between gap-4 shadow-lg flex-shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-700 shadow-xs hover:bg-slate-200 active:scale-90 transition"
            >
              <IoRemove size={16} />
            </button>
            <span className="font-heading font-black text-sm px-2 min-w-5 text-center text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-700 shadow-xs hover:bg-slate-200 active:scale-90 transition"
            >
              <IoAdd size={16} />
            </button>
          </div>

          {/* Price & Add to Cart Button */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Total Price
              </span>
              <span className="font-heading text-lg sm:text-xl font-black text-slate-900">
                ₹{totalItemPrice}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 transition"
            >
              <IoRestaurantOutline size={18} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeMealModal;
