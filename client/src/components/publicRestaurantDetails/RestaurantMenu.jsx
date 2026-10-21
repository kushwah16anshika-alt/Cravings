import React, { useMemo, useState } from "react";
import { IoSearch, IoSparkles } from "react-icons/io5";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { TbChefHat } from "react-icons/tb";
import { foodTypeDot } from "./helpers";
import MenuItemCard from "./MenuItemCard";

const RestaurantMenu = ({ menuItems, restaurantId, restaurantName }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFoodType, setActiveFoodType] = useState("All");
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);

  // Exclude discontinued + deleted; keep available & unavailable
  const activeItems = useMemo(
    () =>
      (menuItems || []).filter(
        (item) => item && !item.isDeleted && item.status !== "discontinued"
      ),
    [menuItems]
  );

  const categories = useMemo(() => {
    const cats = [...new Set(activeItems.map((i) => i.category).filter(Boolean))];
    return ["All", ...cats];
  }, [activeItems]);

  const foodTypes = useMemo(() => {
    const types = [...new Set(activeItems.map((i) => i.foodType).filter(Boolean))];
    return ["All", ...types];
  }, [activeItems]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return activeItems.filter((item) => {
      const name = (item.itemName || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      const matchSearch = !q || name.includes(q) || desc.includes(q);

      const matchCategory =
        activeCategory === "All" ||
        (item.category || "").toLowerCase() === activeCategory.toLowerCase();

      const matchFoodType =
        activeFoodType === "All" ||
        (item.foodType || "").toLowerCase() === activeFoodType.toLowerCase();

      const isCustomizable =
        Boolean(item.customizationOptions?.isCustomizable) ||
        (Array.isArray(item.customizationOptions?.sizes) && item.customizationOptions.sizes.length > 0) ||
        (Array.isArray(item.customizationOptions?.addOns) && item.customizationOptions.addOns.length > 0) ||
        (Array.isArray(item.customizationOptions?.crustsOrBases) && item.customizationOptions.crustsOrBases.length > 0);

      const matchCustomizable = !onlyCustomizable || isCustomizable;

      return matchSearch && matchCategory && matchFoodType && matchCustomizable;
    });
  }, [activeItems, searchQuery, activeCategory, activeFoodType, onlyCustomizable]);

  return (
    <>
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden space-y-0">
        {/* Banner: In-Restaurant Meal Customization */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-xs flex-shrink-0 shadow-sm">
              <TbChefHat size={24} className="sm:text-[26px]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-xs">
                  <IoSparkles size={10} />
                  <span>Kitchen Customization</span>
                </span>
              </div>
              <h3 className="font-heading text-sm sm:text-lg font-black text-white">
                Customize any dish from {restaurantName || "our kitchen"}
              </h3>
              <p className="text-xs text-orange-100 font-medium">
                Personalize portion sizes, spice levels, add-ons, dips & special chef instructions directly on any dish below.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOnlyCustomizable((prev) => !prev)}
            className={`self-start sm:self-center flex-shrink-0 flex items-center gap-2 rounded-2xl px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-black shadow-md active:scale-95 transition ${
              onlyCustomizable
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-white text-orange-700 hover:bg-orange-50"
            }`}
          >
            <IoSparkles className={onlyCustomizable ? "text-amber-400" : "text-orange-600"} />
            <span>{onlyCustomizable ? "Show All Dishes" : "Filter Highlighted Dishes"}</span>
          </button>
        </div>

        {/* Header & Sticky Filter Strip */}
        <div className="p-4 sm:p-6 border-b border-slate-100 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600 flex-shrink-0">
                <MdOutlineRestaurantMenu size={20} />
              </div>
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-black text-slate-900">
                  Menu & Dishes
                </h2>
                <p className="text-xs font-bold text-slate-400">
                  {activeItems.length} freshly prepared items
                </p>
              </div>
            </div>

            {/* Quick Toggle for Customizable Dishes */}
            <button
              onClick={() => setOnlyCustomizable((prev) => !prev)}
              className={`self-start sm:self-auto flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-xl border transition ${
                onlyCustomizable
                  ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                  : "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
              }`}
            >
              <IoSparkles size={12} />
              <span>Customizable Only</span>
            </button>
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
        <div className="p-3.5 sm:p-6">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <span className="text-4xl">🍽️</span>
              <p className="text-sm font-bold text-slate-700 mt-2">
                {activeItems.length === 0
                  ? "No dishes listed yet"
                  : "No matching dishes"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {activeItems.length === 0
                  ? "This restaurant has not added any dishes to their menu yet."
                  : "Try switching category tabs or clearing your custom filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {filteredItems.map((item, idx) => (
                <MenuItemCard
                  key={item._id || item.id || `menu-item-${idx}`}
                  item={item}
                  restaurantId={restaurantId}
                  restaurantName={restaurantName}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RestaurantMenu;