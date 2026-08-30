import React, { useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { foodTypeDot } from "./helpers";
import MenuItemCard from "./MenuItemCard";

const RestaurantMenu = ({ menuItems, restaurantId, restaurantName }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFoodType, setActiveFoodType] = useState("All");

  // Exclude discontinued + deleted; keep available & unavailable
  const activeItems = useMemo(
    () =>
      (menuItems || []).filter(
        (item) => !item.isDeleted && item.status !== "discontinued"
      ),
    [menuItems]
  );

  const categories = useMemo(() => {
    const cats = [...new Set(activeItems.map((i) => i.category))];
    return ["All", ...cats];
  }, [activeItems]);

  const foodTypes = useMemo(() => {
    const types = [...new Set(activeItems.map((i) => i.foodType))];
    return ["All", ...types];
  }, [activeItems]);

  const filteredItems = useMemo(() => {
    return activeItems.filter((item) => {
      const matchSearch =
        !searchQuery ||
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchFoodType =
        activeFoodType === "All" || item.foodType === activeFoodType;
      return matchSearch && matchCategory && matchFoodType;
    });
  }, [activeItems, searchQuery, activeCategory, activeFoodType]);

  return (
    <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header & Sticky Filter Strip */}
      <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <MdOutlineRestaurantMenu size={20} />
            </div>
            <div>
              <h2 className="font-heading text-xl font-black text-slate-900">
                Menu & Dishes
              </h2>
              <p className="text-xs font-bold text-slate-400">
                {activeItems.length} freshly prepared items
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600 text-base" />
          <input
            type="text"
            placeholder="Search items in this menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
          />
        </div>

        {/* Food Type Filter */}
        {foodTypes.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {foodTypes.map((type) => {
              const active = activeFoodType === type;
              return (
                <button
                  key={type}
                  onClick={() => setActiveFoodType(type)}
                  className={`flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-xl border transition ${
                    active
                      ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:border-orange-200"
                  }`}
                >
                  {type !== "All" && (
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${foodTypeDot(
                        type
                      )}`}
                    />
                  )}
                  {type}
                </button>
              );
            })}
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 text-xs font-extrabold px-4 py-2 rounded-xl transition ${
                  active
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="p-5 sm:p-6">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <span className="text-4xl">🍽️</span>
            <p className="text-sm font-bold text-slate-700 mt-2">No matching dishes</p>
            <p className="text-xs text-slate-400 mt-1">Try switching category tabs or clearing search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                restaurantId={restaurantId}
                restaurantName={restaurantName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;