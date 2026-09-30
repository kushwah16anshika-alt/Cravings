import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import api from "../../../config/api.config.js";
import toast from "react-hot-toast";
import { FaRegFileImage } from "react-icons/fa";
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

const AddNewItemModal = ({ isOpen, onClose, onActionSuccess }) => {
  const [newItemFormData, setNewItemFormData] = React.useState({
    itemName: "",
    description: "",
    price: "",
    category: "",
    foodType: "",
    status: "available",
    isTopRated: false,
    isRecommended: false,
    isNew: true,
    isDeleted: false,
  });

  // Customization options state
  const [isCustomizable, setIsCustomizable] = React.useState(true);
  const [sizes, setSizes] = React.useState([
    { name: "Regular", priceExtra: 0 },
    { name: "Large", priceExtra: 60 },
  ]);
  const [addOns, setAddOns] = React.useState([
    { name: "Extra Cheese", price: 40 },
    { name: "Extra Dip / Sauce", price: 20 },
  ]);
  const [spiceLevels, setSpiceLevels] = React.useState([
    "Mild",
    "Medium",
    "Spicy",
    "Extra Hot",
  ]);

  const [previewImage, setPreviewImage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [itemImage, setItemImage] = React.useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNewItemFormData((prevData) => ({
      ...prevData,
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

  const handleAddNewItem = async () => {
    if (!newItemFormData.itemName.trim()) {
      toast.error("Please enter item name.");
      return;
    }

    if (!newItemFormData.price) {
      toast.error("Please enter item price.");
      return;
    }

    if (!newItemFormData.category) {
      toast.error("Please select item category.");
      return;
    }

    if (!newItemFormData.foodType) {
      toast.error("Please select food type.");
      return;
    }

    if (!itemImage) {
      toast.error("Please upload an item image.");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("itemName", newItemFormData.itemName);
      formData.append("description", newItemFormData.description);
      formData.append("price", newItemFormData.price);
      formData.append("category", newItemFormData.category);
      formData.append("foodType", newItemFormData.foodType);
      formData.append("status", newItemFormData.status);
      formData.append("isTopRated", newItemFormData.isTopRated);
      formData.append("isRecommended", newItemFormData.isRecommended);
      formData.append("isNew", newItemFormData.isNew);
      formData.append("isDeleted", newItemFormData.isDeleted);

      // Customization options payload
      const customizationOptions = {
        isCustomizable,
        sizes: sizes.filter((s) => s.name.trim()),
        addOns: addOns.filter((a) => a.name.trim()),
        spiceLevels,
      };
      formData.append("customizationOptions", JSON.stringify(customizationOptions));

      if (itemImage) {
        formData.append("itemImage", itemImage);
      }

      const response = await api.post(
        "/restaurant/add-menu-item",
        formData,
      );

      toast.success(
        response.data.message || "Menu item added successfully",
      );

      if (onActionSuccess) {
        await onActionSuccess();
      }

      handleOnClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to add menu item. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnClose = () => {
    if (isLoading) return;

    setNewItemFormData({
      itemName: "",
      description: "",
      price: "",
      category: "",
      foodType: "",
      status: "available",
      isTopRated: false,
      isRecommended: false,
      isNew: true,
      isDeleted: false,
    });

    setItemImage(null);
    setPreviewImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <header className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h2 className="text-xl font-heading font-black text-slate-900">
            Add New Menu Item
          </h2>

          <button
            type="button"
            onClick={handleOnClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <IoMdCloseCircleOutline size={26} />
          </button>
        </header>

        <main className="mt-5">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Image Upload Area */}
              <div className="md:col-span-1">
                <span className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Item Photo
                </span>

                <div className="border-2 border-dashed border-orange-200 bg-orange-50/40 rounded-2xl h-52 flex flex-col items-center justify-center relative overflow-hidden transition hover:border-orange-400">
                  {previewImage ? (
                    <label
                      htmlFor="itemImage"
                      className="cursor-pointer h-full w-full"
                    >
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </label>
                  ) : (
                    <label
                      htmlFor="itemImage"
                      className="cursor-pointer flex flex-col items-center justify-center h-full text-center text-orange-600/70 hover:text-orange-600 p-4"
                    >
                      <FaRegFileImage size={32} className="mb-2" />
                      <span className="text-xs font-bold">
                        Click to upload appetizing photo
                      </span>
                    </label>
                  )}

                  <input
                    type="file"
                    id="itemImage"
                    name="itemImage"
                    accept="image/*"
                    className="hidden"
                    disabled={isLoading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setItemImage(file);
                      setPreviewImage(URL.createObjectURL(file));
                    }}
                  />
                </div>
              </div>

              {/* Basic Details */}
              <div className="space-y-4 md:col-span-2">
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700" htmlFor="itemName">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    name="itemName"
                    value={newItemFormData.itemName}
                    onChange={handleInputChange}
                    placeholder="e.g. Artisanal Truffle Pizza"
                    disabled={isLoading}
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700" htmlFor="itemPrice">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="itemPrice"
                    name="price"
                    min="0"
                    placeholder="299"
                    value={newItemFormData.price}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700" htmlFor="itemCategory">
                      Category *
                    </label>
                    <select
                      id="itemCategory"
                      name="category"
                      value={newItemFormData.category}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-orange-500"
                    >
                      <option value="">Select Category</option>
                      {itemCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700" htmlFor="itemType">
                      Diet / Food Type *
                    </label>
                    <select
                      id="itemType"
                      name="foodType"
                      value={newItemFormData.foodType}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-orange-500"
                    >
                      <option value="">Select Diet Type</option>
                      {foodTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-3">
                <label className="block mb-1 text-xs font-bold text-slate-700" htmlFor="itemDescription">
                  Description
                </label>
                <textarea
                  id="itemDescription"
                  name="description"
                  rows={2}
                  value={newItemFormData.description}
                  onChange={handleInputChange}
                  placeholder="Fresh ingredients, delicate preparation and rich flavors..."
                  disabled={isLoading}
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 focus:outline-hidden focus:border-orange-500 resize-none"
                />
              </div>
            </div>

            {/* Meal Customization Settings Box */}
            <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IoSparkles className="text-orange-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Meal Customization Options
                  </h3>
                </div>

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
              </div>

              {isCustomizable && (
                <div className="space-y-4 pt-2">
                  {/* Portion / Sizes Configuration */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Portion Sizes (Name & Extra Price ₹)
                      </span>
                      <button
                        type="button"
                        onClick={handleAddSize}
                        className="text-[11px] font-black text-orange-600 hover:underline flex items-center gap-0.5"
                      >
                        <IoAdd /> Add Size
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sizes.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                          <input
                            type="text"
                            value={s.name}
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
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setSizes((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, priceExtra: val } : item))
                              );
                            }}
                            className="w-14 text-xs font-bold text-right outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(idx)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <IoTrashOutline size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add-ons Configuration */}
                  <div className="space-y-2 pt-2 border-t border-orange-200/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Extra Add-ons & Toppings (Name & Price ₹)
                      </span>
                      <button
                        type="button"
                        onClick={handleAddAddon}
                        className="text-[11px] font-black text-orange-600 hover:underline flex items-center gap-0.5"
                      >
                        <IoAdd /> Add Extra
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {addOns.map((a, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                          <input
                            type="text"
                            value={a.name}
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
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setAddOns((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, price: val } : item))
                              );
                            }}
                            className="w-14 text-xs font-bold text-right outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveAddon(idx)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <IoTrashOutline size={14} />
                          </button>
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
            onClick={handleOnClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAddNewItem}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-xs font-black text-white shadow-md shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 transition"
          >
            {isLoading ? "Saving Dish..." : "Add Menu Item"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddNewItemModal;