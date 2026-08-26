import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import api from "../../../config/api.config.js";
import toast from "react-hot-toast";
import { FaRegFileImage } from "react-icons/fa";

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

    setPreviewImage(null);
    setItemImage(null);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <header className="flex justify-between items-center border-b border-(--color-secondary) pb-2 mb-4">
          <h2 className="text-lg font-semibold">Add New Item</h2>

          <button
            type="button"
            className="text-red-300 hover:text-red-500"
            onClick={handleOnClose}
            disabled={isLoading}
          >
            <IoMdCloseCircleOutline size={24} />
          </button>
        </header>

        <main>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddNewItem();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Image */}
              <div className="flex justify-center items-center">
                <div className="h-52 w-52 border-2 border-(--color-primary) rounded overflow-hidden">
                  {previewImage ? (
                    <label
                      htmlFor="itemImage"
                      className="cursor-pointer block h-full w-full"
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
                      className="cursor-pointer flex flex-col items-center justify-center h-full text-center text-(--color-primary)/60 hover:text-(--color-primary)"
                    >
                      <FaRegFileImage size={32} className="mb-2" />

                      <span className="text-sm px-3">
                        Click here to upload an image
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
                  <label
                    className="block mb-1 font-medium"
                    htmlFor="itemName"
                  >
                    Item Name
                  </label>

                  <input
                    type="text"
                    id="itemName"
                    name="itemName"
                    value={newItemFormData.itemName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    className="block mb-1 font-medium"
                    htmlFor="itemPrice"
                  >
                    Item Price
                  </label>

                  <input
                    type="number"
                    id="itemPrice"
                    name="price"
                    min="0"
                    value={newItemFormData.price}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block mb-1 font-medium"
                      htmlFor="itemCategory"
                    >
                      Item Category
                    </label>

                    <select
                      id="itemCategory"
                      name="category"
                      value={newItemFormData.category}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
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
                    <label
                      className="block mb-1 font-medium"
                      htmlFor="itemType"
                    >
                      Food Type
                    </label>

                    <select
                      id="itemType"
                      name="foodType"
                      value={newItemFormData.foodType}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                    >
                      <option value="">Select Food Type</option>

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
                <label
                  className="block mb-1 font-medium"
                  htmlFor="itemDescription"
                >
                  Item Description
                </label>

                <textarea
                  id="itemDescription"
                  name="description"
                  rows={4}
                  value={newItemFormData.description}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                />
              </div>
            </div>
          </form>
        </main>

        <footer className="flex justify-between border-t border-(--color-secondary) pt-3 mt-5">
          <button
            type="button"
            onClick={handleOnClose}
            disabled={isLoading}
            className="bg-(--color-secondary) disabled:bg-(--color-secondary)/60 text-(--color-secondary-content) px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAddNewItem}
            disabled={isLoading}
            className="bg-(--color-primary) disabled:bg-(--color-primary)/60 text-(--color-primary-content) px-5 py-2 rounded"
          >
            {isLoading ? "Adding..." : "Add Item"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddNewItemModal;