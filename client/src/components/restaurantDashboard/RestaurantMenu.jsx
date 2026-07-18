import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import { MdAdd, MdClose } from "react-icons/md";

const RestaurantMenu = () => {
  const { user } = useAuth();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    fetchMenuItems();
  }, [user?._id]);

  const fetchMenuItems = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const response = await api.get(`/menu/${user._id}`);

      if (response.data.success) {
        setMenuItems(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/menu/create", {
        ...formData,
        restaurantId: user._id,
      });

      if (response.data.success) {
        toast.success("Menu item added");

        setMenuItems([...menuItems, response.data.data]);

        setFormData({
          itemName: "",
          description: "",
          price: "",
          category: "",
        });

        setIsAdding(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add item");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-(--color-neutral)">
        Loading menu...
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Menu Management</h2>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-4 py-2 rounded-xl font-semibold"
        >
          {isAdding ? (
            <>
              <MdClose />
              Cancel
            </>
          ) : (
            <>
              <MdAdd />
              Add Item
            </>
          )}
        </button>
      </div>

      {/* Add Menu Form */}

      {isAdding && (
        <div className="bg-(--color-base-200) p-6 rounded-xl mb-6">
          <h3 className="text-lg font-semibold mb-5">Add New Menu Item</h3>

          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="itemName"
                placeholder="Item Name"
                value={formData.itemName}
                onChange={handleChange}
                required
                className="p-3 rounded-lg border border-(--color-secondary) bg-transparent"
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
                className="p-3 rounded-lg border border-(--color-secondary) bg-transparent"
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                className="p-3 rounded-lg border border-(--color-secondary) bg-transparent"
              />
            </div>

            <textarea
              name="description"
              placeholder="Description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-(--color-secondary) bg-transparent"
            />

            <button
              type="submit"
              className="w-full bg-(--color-primary) text-(--color-primary-content) py-3 rounded-lg font-semibold"
            >
              Save Item
            </button>
          </form>
        </div>
      )}

      {/* Menu Table */}

      <div className="bg-(--color-base-200) p-5 rounded-xl">
        {menuItems.length === 0 ? (
          <div className="text-center py-10 text-(--color-neutral)">
            No menu items available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--color-secondary)">
                  <th className="text-left py-3 text-sm">Item</th>

                  <th className="text-left py-3 text-sm">Category</th>

                  <th className="text-left py-3 text-sm">Price</th>

                  <th className="text-left py-3 text-sm">Status</th>
                </tr>
              </thead>

              <tbody>
                {menuItems.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-(--color-secondary) hover:bg-(--color-base-100)"
                  >
                    <td className="py-3">
                      <p className="font-semibold">{item.itemName}</p>

                      <p className="text-xs text-(--color-neutral)">
                        {item.description}
                      </p>
                    </td>

                    <td className="py-3">{item.category}</td>

                    <td className="py-3 font-semibold">₹{item.price}</td>

                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          item.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;
