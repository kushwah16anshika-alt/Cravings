import { useState, useEffect } from "react";

import { FaAward } from "react-icons/fa";
import {
  LuPencilLine,
  LuTrash2,
  LuEye,
  LuChevronDown,
} from "react-icons/lu";
import { AiTwotoneLike } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";

import ConfirmModal from "./menuItems/ConfirmModal";
import AddNewItemModal from "./menuItems/AddNewItemModal";
import EditOrViewItem from "./menuItems/EditOrViewItem";

import api from "../../config/api.config.js";
import toast from "react-hot-toast";

import loader from "../../assets/runningLoader.gif";

// ======================================
// Status Styles
// ======================================

const statusChipStyles = {
  available: "bg-green-100 text-green-700 border border-green-300",
  unavailable: "bg-amber-100 text-amber-700 border border-amber-300",
  discontinued: "bg-rose-100 text-rose-700 border border-rose-300",
};

const statusLabels = {
  available: "Available",
  unavailable: "Unavailable",
  discontinued: "Discontinued",
};

// ======================================
// Restaurant Menu
// ======================================

const RestaurantMenu = () => {
  // ======================================
  // States
  // ======================================

  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");

  const [isAddNewItemModalOpen, setIsAddNewItemModalOpen] =
    useState(false);

  const [isEditViewItemModalOpen, setIsEditViewItemModalOpen] =
    useState(false);

  const [isControlsModalOpen, setIsControlsModalOpen] =
    useState(false);

  const [modalMode, setModalMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // ======================================
  // Fetch Menu Items
  // ======================================

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);

      const response = await api.get("/restaurant/menu-items", {
        params: {
          t: Date.now(),
        },
      });

      console.log("Menu Items Response:", response.data);

      setMenuItems(response.data?.data || []);
    } catch (error) {
      console.error("Fetch menu items error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to fetch menu items. Please try again."
      );

      setMenuItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ======================================
  // Fetch on Component Load
  // ======================================

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // ======================================
  // Search
  // ======================================

  const filteredItems = menuItems.filter((item) => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return true;
    }

    return (
      item.itemName?.toLowerCase().includes(value) ||
      item.category?.toLowerCase().includes(value) ||
      item.description?.toLowerCase().includes(value) ||
      item.foodType?.toLowerCase().includes(value)
    );
  });

  // ======================================
  // Update Status
  // ======================================

  const handleStatusChange = async (itemId, status) => {
    try {
      const response = await api.patch(
        `/restaurant/menu-item/${itemId}/status?status=${encodeURIComponent(
          status
        )}`
      );

      toast.success(
        response.data?.message ||
          "Item status updated successfully."
      );

      await fetchMenuItems();
    } catch (error) {
      console.error("Update status error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update item status. Please try again."
      );
    }
  };

  // ======================================
  // Loading
  // ======================================

  if (isLoading) {
    return (
      <div className="h-full min-h-[400px] flex items-center justify-center">
        <img
          src={loader}
          alt="Loading..."
          className="w-20 h-20 object-contain"
        />
      </div>
    );
  }

  // ======================================
  // UI
  // ======================================

  return (
    <>
      <div className="overflow-y-auto h-full">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 px-1 mb-6">

          <h2 className="text-2xl font-bold text-(--color-primary)">
            Menu Management
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

            {/* Add New Item */}

            <button
              type="button"
              onClick={() => setIsAddNewItemModalOpen(true)}
              className="
                border
                border-(--color-primary)
                text-(--color-primary)
                hover:bg-(--color-primary)
                hover:text-white
                px-4
                py-2
                rounded-lg
                transition-all
                duration-200
                flex
                items-center
                justify-center
                gap-2
                font-medium
              "
            >
              <IoMdAddCircleOutline className="text-lg" />

              Add New Item
            </button>

            {/* Search */}

            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                border
                border-(--color-primary)
                rounded-lg
                px-4
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-(--color-primary)
                transition-all
                duration-200
                min-w-[220px]
              "
            />

          </div>
        </div>

        {/* ================= TABLE CONTAINER ================= */}

        <div className="bg-(--color-base-200) p-4 rounded-xl shadow-sm">

          {/* ================= TABLE HEADER ================= */}

          <div
            className="
              text-(--color-primary)
              grid
              grid-cols-7
              gap-4
              font-bold
              border-b
              border-(--color-secondary)
              py-3
              px-2
            "
          >
            <div className="col-span-2">
              Item Name & Description
            </div>

            <div className="text-center">
              Price
            </div>

            <div>
              Category & Type
            </div>

            <div>
              Status
            </div>

            <div>
              Controls
            </div>

            <div>
              Actions
            </div>
          </div>

          {/* ================= TABLE ROWS ================= */}

          <div className="overflow-y-auto max-h-[65vh]">

            {filteredItems.length === 0 ? (

              <div className="text-center py-10 text-(--color-primary)/70">
                {search
                  ? "No menu items found matching your search."
                  : "No menu items found."}
              </div>

            ) : (

              filteredItems.map((item, index) => (

                <div
                  key={item._id || index}
                  className="
                    grid
                    grid-cols-7
                    gap-4
                    border-b
                    border-(--color-secondary)/40
                    py-3
                    px-2
                    items-center
                    hover:bg-(--color-base-100)
                    transition-colors
                  "
                >

                  {/* ================= ITEM ================= */}

                  <div className="col-span-2 flex items-center gap-4 min-w-0">

                    <div className="shrink-0">

                      {item.image?.url ? (

                        <img
                          src={item.image.url}
                          alt={item.itemName || "Menu item"}
                          className="
                            w-16
                            h-16
                            object-cover
                            rounded-lg
                          "
                        />

                      ) : (

                        <div
                          className="
                            w-16
                            h-16
                            rounded-lg
                            bg-(--color-base-100)
                            flex
                            items-center
                            justify-center
                            text-(--color-primary)
                            text-2xl
                          "
                        >
                          🍽
                        </div>

                      )}

                    </div>

                    <div className="w-full min-w-0">

                      <div className="font-semibold truncate">
                        {item.itemName || "Unnamed Item"}
                      </div>

                      <div className="text-xs text-gray-500 line-clamp-2">
                        {item.description ||
                          "No description available."}
                      </div>

                    </div>

                  </div>

                  {/* ================= PRICE ================= */}

                  <div className="text-center font-medium">
                    ₹{Number(item.price || 0).toFixed(2)}
                  </div>

                  {/* ================= CATEGORY ================= */}

                  <div>

                    <div className="font-medium">
                      {item.category || "-"}
                    </div>

                    <div className="text-sm text-gray-500 capitalize">
                      {item.foodType || "-"}
                    </div>

                  </div>

                  {/* ================= STATUS ================= */}

                  <div>

                    <div className="relative inline-flex items-center">

                      <select
                        value={item.status || "available"}
                        onChange={(e) =>
                          handleStatusChange(
                            item._id,
                            e.target.value
                          )
                        }
                        className={`
                          appearance-none
                          rounded-md
                          pl-3
                          pr-8
                          py-1.5
                          text-xs
                          font-semibold
                          tracking-wide
                          transition-colors
                          cursor-pointer
                          focus:outline-none
                          focus:ring-2
                          focus:ring-(--color-primary)
                          ${
                            statusChipStyles[item.status] ||
                            statusChipStyles.available
                          }
                        `}
                      >

                        <option value="available">
                          {statusLabels.available}
                        </option>

                        <option value="unavailable">
                          {statusLabels.unavailable}
                        </option>

                        <option value="discontinued">
                          {statusLabels.discontinued}
                        </option>

                      </select>

                      <LuChevronDown
                        className="
                          pointer-events-none
                          absolute
                          right-2
                          text-xs
                          opacity-70
                        "
                      />

                    </div>

                  </div>

                  {/* ================= CONTROLS ================= */}

                  <div className="flex gap-2 items-center">

                    {/* Top Rated */}

                    <button
                      type="button"
                      className={`
                        rounded
                        flex
                        items-center
                        justify-center
                        text-lg
                        hover:scale-110
                        transition-transform
                        ${
                          item.isTopRated
                            ? "text-(--color-primary)"
                            : "text-(--color-secondary)"
                        }
                      `}
                      title={
                        item.isTopRated
                          ? "Top Rated"
                          : "Mark as Top Rated"
                      }
                      onClick={() => {
                        setSelectedItem(item);
                        setModalMode("topRated");
                        setIsControlsModalOpen(true);
                      }}
                    >
                      <FaAward />
                    </button>

                    {/* Recommended */}

                    <button
                      type="button"
                      className={`
                        rounded
                        flex
                        items-center
                        justify-center
                        text-lg
                        hover:scale-110
                        transition-transform
                        ${
                          item.isRecommended
                            ? "text-(--color-primary)"
                            : "text-(--color-secondary)"
                        }
                      `}
                      title={
                        item.isRecommended
                          ? "Recommended"
                          : "Mark as Recommended"
                      }
                      onClick={() => {
                        setSelectedItem(item);
                        setModalMode("recommended");
                        setIsControlsModalOpen(true);
                      }}
                    >
                      <AiTwotoneLike />
                    </button>

                    {/* New */}

                    <button
                      type="button"
                      className={`
                        px-1.5
                        py-0.5
                        rounded
                        flex
                        items-center
                        justify-center
                        text-xs
                        ${
                          item.isNew
                            ? "text-(--color-primary) border border-(--color-primary)"
                            : "text-(--color-secondary) border border-(--color-secondary)"
                        }
                      `}
                      title={
                        item.isNew
                          ? "New Item"
                          : "Mark as New"
                      }
                      onClick={() => {
                        setSelectedItem(item);
                        setModalMode("new");
                        setIsControlsModalOpen(true);
                      }}
                    >
                      New
                    </button>

                  </div>

                  {/* ================= ACTIONS ================= */}

                  <div className="flex gap-2">

                    {/* Edit */}

                    <button
                      type="button"
                      className="
                        p-2
                        border
                        border-(--color-primary)
                        text-(--color-primary)
                        hover:bg-(--color-primary)
                        hover:text-white
                        rounded-lg
                        transition-colors
                      "
                      title="Edit Item"
                      onClick={() => {
                        setSelectedItem(item);
                        setModalMode("edit");
                        setIsEditViewItemModalOpen(true);
                      }}
                    >
                      <LuPencilLine />
                    </button>

                    {/* View */}

                    <button
                      type="button"
                      className="
                        p-2
                        border
                        border-(--color-primary)
                        text-(--color-primary)
                        hover:bg-(--color-primary)
                        hover:text-white
                        rounded-lg
                        transition-colors
                      "
                      title="View Item Details"
                      onClick={() => {
                        setSelectedItem(item);
                        setModalMode("view");
                        setIsEditViewItemModalOpen(true);
                      }}
                    >
                      <LuEye />
                    </button>

                    {/* Delete */}

                    <button
                      type="button"
                      className="
                        p-2
                        border
                        border-(--color-primary)
                        text-(--color-primary)
                        hover:bg-(--color-primary)
                        hover:text-white
                        rounded-lg
                        transition-colors
                      "
                      title="Delete Item"
                      onClick={() => {
                        setSelectedItem(item);
                        setModalMode("delete");
                        setIsControlsModalOpen(true);
                      }}
                    >
                      <LuTrash2 />
                    </button>

                  </div>

                </div>
              ))
            )}

          </div>
        </div>
      </div>

      {/* ================= CONFIRM MODAL ================= */}

      {isControlsModalOpen && (
        <ConfirmModal
          selectedItem={selectedItem}
          modalMode={modalMode}
          isOpen={isControlsModalOpen}
          onClose={() => {
            setIsControlsModalOpen(false);
            setSelectedItem(null);
            setModalMode(null);
          }}
          onActionSuccess={fetchMenuItems}
        />
      )}

      {/* ================= ADD NEW ITEM MODAL ================= */}

      {isAddNewItemModalOpen && (
        <AddNewItemModal
          isOpen={isAddNewItemModalOpen}
          onClose={() => {
            setIsAddNewItemModalOpen(false);
          }}
          onActionSuccess={fetchMenuItems}
        />
      )}

      {/* ================= EDIT / VIEW MODAL ================= */}

      {isEditViewItemModalOpen && (
        <EditOrViewItem
          selectedItem={selectedItem}
          modalMode={modalMode}
          isOpen={isEditViewItemModalOpen}
          onClose={() => {
            setIsEditViewItemModalOpen(false);
            setSelectedItem(null);
            setModalMode(null);
          }}
          onActionSuccess={fetchMenuItems}
        />
      )}
    </>
  );
};

export default RestaurantMenu;