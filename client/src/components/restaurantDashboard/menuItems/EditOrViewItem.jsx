import { useMemo, useState, useEffect } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import api from "../../../config/api.config.js";
import { IoSparkles, IoAdd, IoTrashOutline } from "react-icons/io5";

const itemCategories = [
  "Appetizer",
  "Main Course",
  "Dessert",
  "Beverage",
  "Salad",
  "Soup",
  "Side Dish",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Pizza",
  "Pasta",
  "Burger",
  "Sandwich",
  "Seafood",
  "Rice",
  "Wrap",
  "Starter",
  "Drink",
  "Other",
];

const foodTypes = [
  "Vegetarian",
  "Non-Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Egg-Free",
  "Other",
];

const statusOptions = ["available", "unavailable", "discontinued"];

const getDefaultFormData = (item) => ({
  itemName: item?.itemName || "",
  description: item?.description || "",
  price: item?.price ?? "",
  category: item?.category || "",
  foodType: item?.foodType || "",
  status: item?.status || "available",
  isTopRated: !!item?.isTopRated,
  isRecommended: !!item?.isRecommended,
  isNew: !!item?.isNew,
});

const EditOrViewItem = ({
  selectedItem,
  modalMode,
  isOpen,
  onClose,
  onActionSuccess,
}) => {
  const isViewMode = modalMode === "view";

  const [formData, setFormData] = useState(
    getDefaultFormData(selectedItem),
  );

  const [isCustomizable, setIsCustomizable] = useState(
    selectedItem?.customizationOptions?.isCustomizable ?? true
  );
  const [sizes, setSizes] = useState(
    selectedItem?.customizationOptions?.sizes?.length
      ? selectedItem.customizationOptions.sizes
      : [
          { name: "Regular", priceExtra: 0 },
          { name: "Large", priceExtra: 60 },
        ]
  );
  const [addOns, setAddOns] = useState(
    selectedItem?.customizationOptions?.addOns?.length
      ? selectedItem.customizationOptions.addOns
      : [
          { name: "Extra Cheese", price: 40 },
          { name: "Extra Dip / Sauce", price: 20 },
        ]
  );

  const [itemImage, setItemImage] = useState(null);

  const [previewImage, setPreviewImage] = useState(
    selectedItem?.image?.url || null,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setFormData(getDefaultFormData(selectedItem));
      setPreviewImage(selectedItem?.image?.url || null);
      setIsCustomizable(selectedItem?.customizationOptions?.isCustomizable ?? true);
      setSizes(
        selectedItem?.customizationOptions?.sizes?.length
          ? selectedItem.customizationOptions.sizes
          : [
              { name: "Regular", priceExtra: 0 },
              { name: "Large", priceExtra: 60 },
            ]
      );
      setAddOns(
        selectedItem?.customizationOptions?.addOns?.length
          ? selectedItem.customizationOptions.addOns
          : [
              { name: "Extra Cheese", price: 40 },
              { name: "Extra Dip / Sauce", price: 20 },
            ]
      );
    }
  }, [selectedItem]);

  const modalTitle = useMemo(
    () => (isViewMode ? "View Menu Item" : "Edit Menu Item"),
    [isViewMode],
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSize = () => {
    setSizes((prev) => [...prev, { name: "", priceExtra: 0 }]);
  };

  const handleRemoveSize = (idx) => {
    setSizes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddAddon = () => {
    setAddOns((prev) => [...prev, { name: "", price: 0 }]);
  };

  const handleRemoveAddon = (idx) => {
    setAddOns((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateItem = async () => {
    if (!selectedItem?._id) {
      toast.error("Invalid menu item selected.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = new FormData();

      payload.append("itemName", formData.itemName);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("category", formData.category);
      payload.append("foodType", formData.foodType);
      payload.append("status", formData.status);
      payload.append("isTopRated", formData.isTopRated);
      payload.append("isRecommended", formData.isRecommended);
      payload.append("isNew", formData.isNew);

      // Customization options payload
      const customizationOptions = {
        isCustomizable,
        sizes: sizes.filter((s) => s.name.trim()),
        addOns: addOns.filter((a) => a.name.trim()),
        spiceLevels: ["Mild", "Medium", "Spicy", "Extra Hot"],
      };
      payload.append("customizationOptions", JSON.stringify(customizationOptions));

      if (itemImage) {
        payload.append("itemImage", itemImage);
      }

      const response = await api.put(
        `/restaurant/menu-item/${selectedItem._id}`,
        payload,
      );

      toast.success(
        response.data.message || "Menu item updated successfully",
      );

      if (onActionSuccess) {
        await onActionSuccess();
      }

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to update item details. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <header className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h2 className="text-xl font-heading font-black text-slate-900">
            {modalTitle}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <IoMdCloseCircleOutline size={26} />
          </button>
        </header>

        <main className="mt-5">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Image Preview & Upload */}
              <div className="md:col-span-1">
                <span className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Item Photo
                </span>

                <div className="border-2 border-dashed border-orange-200 bg-orange-50/40 rounded-2xl h-52 flex flex-col items-center justify-center relative overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-slate-400 text-xs font-bold">No photo uploaded</div>
                  )}

                  {!isViewMode && (
                    <label
                      htmlFor="editItemImage"
                      className="absolute bottom-2 inset-x-2 bg-slate-950/80 hover:bg-slate-900 text-white text-center text-xs font-bold py-1.5 rounded-xl cursor-pointer transition backdrop-blur-xs"
                    >
                      Change Photo
                    </label>
                  )}

                  <input
                    type="file"
                    id="editItemImage"
                    name="itemImage"
                    accept="image/*"
                    className="hidden"
                    disabled={isViewMode || isSubmitting}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setItemImage(file);
                      setPreviewImage(URL.createObjectURL(file));
                    }}
                  />
                </div>
              </div>

              {/* Basic Fields */}
              <div className="space-y-4 md:col-span-2">
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700" htmlFor="itemName">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    disabled={isViewMode || isSubmitting}
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-orange-500 disabled:bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700" htmlFor="itemPrice">
                      Base Price (₹)
                    </label>
                    <input
                      type="number"
                      id="itemPrice"
                      name="price"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      disabled={isViewMode || isSubmitting}
                      className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-orange-500 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700" htmlFor="status">
                      Item Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={isViewMode || isSubmitting}
                      className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-orange-500 disabled:bg-slate-50 uppercase"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700" htmlFor="category">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={isViewMode || isSubmitting}
                      className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-orange-500 disabled:bg-slate-50"
                    >
                      {itemCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700" htmlFor="foodType">
                      Diet Type
                    </label>
                    <select
                      id="foodType"
                      name="foodType"
                      value={formData.foodType}
                      onChange={handleInputChange}
                      disabled={isViewMode || isSubmitting}
                      className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-orange-500 disabled:bg-slate-50"
                    >
                      {foodTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-3">
                <label className="block mb-1 text-xs font-bold text-slate-700" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isViewMode || isSubmitting}
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 focus:outline-hidden focus:border-orange-500 disabled:bg-slate-50 resize-none"
                />
              </div>
            </div>

            {/* Meal Customization Settings */}
            <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IoSparkles className="text-orange-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Meal Customization Settings
                  </h3>
                </div>

                {!isViewMode && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCustomizable}
                      onChange={(e) => setIsCustomizable(e.target.checked)}
                      className="accent-orange-600 h-4 w-4"
                    />
                    <span className="text-xs font-bold text-slate-700">
                      Enable for this dish
                    </span>
                  </label>
                )}
              </div>

              {isCustomizable && (
                <div className="space-y-4 pt-2">
                  {/* Sizes */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Portion Sizes
                      </span>
                      {!isViewMode && (
                        <button
                          type="button"
                          onClick={handleAddSize}
                          className="text-[11px] font-black text-orange-600 hover:underline flex items-center gap-0.5"
                        >
                          <IoAdd /> Add Size
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sizes.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                          <input
                            type="text"
                            value={s.name}
                            disabled={isViewMode}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSizes((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, name: val } : item))
                              );
                            }}
                            placeholder="e.g. Large"
                            className="flex-1 text-xs font-bold outline-hidden"
                          />
                          <span className="text-xs text-slate-400">+₹</span>
                          <input
                            type="number"
                            value={s.priceExtra}
                            disabled={isViewMode}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setSizes((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, priceExtra: val } : item))
                              );
                            }}
                            className="w-14 text-xs font-bold text-right outline-hidden"
                          />
                          {!isViewMode && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSize(idx)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <IoTrashOutline size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div className="space-y-2 pt-2 border-t border-orange-200/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Add-Ons & Extras
                      </span>
                      {!isViewMode && (
                        <button
                          type="button"
                          onClick={handleAddAddon}
                          className="text-[11px] font-black text-orange-600 hover:underline flex items-center gap-0.5"
                        >
                          <IoAdd /> Add Extra
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {addOns.map((a, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                          <input
                            type="text"
                            value={a.name}
                            disabled={isViewMode}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAddOns((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, name: val } : item))
                              );
                            }}
                            placeholder="e.g. Extra Mozzarella"
                            className="flex-1 text-xs font-bold outline-hidden"
                          />
                          <span className="text-xs text-slate-400">+₹</span>
                          <input
                            type="number"
                            value={a.price}
                            disabled={isViewMode}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setAddOns((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, price: val } : item))
                              );
                            }}
                            className="w-14 text-xs font-bold text-right outline-hidden"
                          />
                          {!isViewMode && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAddon(idx)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <IoTrashOutline size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </main>

        <footer className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            {isViewMode ? "Close" : "Cancel"}
          </button>

          {!isViewMode && (
            <button
              type="button"
              onClick={handleUpdateItem}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-xs font-black text-white shadow-md shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 transition"
            >
              {isSubmitting ? "Saving Changes..." : "Update Menu Item"}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default EditOrViewItem;