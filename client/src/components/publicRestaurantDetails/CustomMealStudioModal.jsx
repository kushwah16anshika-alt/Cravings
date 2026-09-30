import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
  IoClose,
  IoSparkles,
  IoCheckmarkCircle,
  IoFlame,
  IoNutritionOutline,
  IoArrowForward,
  IoArrowBack,
  IoStorefrontOutline,
} from "react-icons/io5";
import {
  MdOutlineFastfood,
  MdOutlineDinnerDining,
  MdOutlineLunchDining,
  MdOutlineLocalPizza,
  MdOutlineRamenDining,
} from "react-icons/md";
import { TbChefHat } from "react-icons/tb";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config";

// Meal Archetypes
const MEAL_TYPES = [
  {
    id: "bowl",
    name: "Power Fitness Bowl",
    tagline: "High protein, wholesome grains & fresh greens",
    emoji: "🥗",
    basePrice: 249,
    baseOptions: [
      { name: "Fragrant Brown Rice", extra: 0, cal: 180 },
      { name: "Organic Quinoa & Greens", extra: 30, cal: 150 },
      { name: "Steamed Jasmine White Rice", extra: 0, cal: 200 },
      { name: "Crunchy Lettuce & Herb Base (Keto)", extra: 20, cal: 60 },
    ],
    proteinOptions: [
      { name: "Grilled Paneer Tikka", extra: 40, type: "veg", cal: 220 },
      { name: "Crispy Herb Roasted Tofu", extra: 35, type: "vegan", cal: 160 },
      { name: "Slow-Smoked Grilled Chicken", extra: 60, type: "non-veg", cal: 240 },
      { name: "Falafel & Mediterranean Hummus", extra: 30, type: "veg", cal: 190 },
      { name: "Sautéed Wild Mushroom Medley", extra: 35, type: "veg", cal: 110 },
    ],
    toppingOptions: [
      { name: "Sweet Golden Corn", extra: 15 },
      { name: "Jalapeños & Black Olives", extra: 25 },
      { name: "Steamed Broccoli & Zucchini", extra: 25 },
      { name: "Cherry Tomatoes & Cucumber", extra: 20 },
      { name: "Roasted Pumpkin & Chia Seeds", extra: 20 },
    ],
    sauceOptions: [
      { name: "Creamy Chipotle Vinaigrette", extra: 20 },
      { name: "Tangy Herb Mint Mayo", extra: 15 },
      { name: "Zesty Lemon Tahini Dressing", extra: 20 },
      { name: "Classic Italian Pesto", extra: 25 },
    ],
    sideOptions: [
      { name: "Garlic Butter Toast (2 pcs)", extra: 35 },
      { name: "Chilled Masala Lemonade", extra: 30 },
      { name: "Berry Iced Tea", extra: 35 },
      { name: "No Additional Side", extra: 0 },
    ],
  },
  {
    id: "thali",
    name: "Royal Desi Thali Box",
    tagline: "Authentic curries, fresh rotis, aromatic rice & sweet",
    emoji: "🍛",
    basePrice: 289,
    baseOptions: [
      { name: "Jeera Basmati Rice + 2 Butter Naan", extra: 0, cal: 380 },
      { name: "Steamed Rice + 2 Tandoori Roti (Wheat)", extra: 0, cal: 320 },
      { name: "Fragrant Biryani Rice + Laccha Paratha", extra: 35, cal: 420 },
    ],
    proteinOptions: [
      { name: "Paneer Butter Masala", extra: 45, type: "veg", cal: 280 },
      { name: "Slow-Cooked Dal Makhani", extra: 30, type: "veg", cal: 240 },
      { name: "Delhi Style Butter Chicken", extra: 75, type: "non-veg", cal: 340 },
      { name: "Royal Mutton Rogan Josh", extra: 95, type: "non-veg", cal: 380 },
      { name: "Kadhai Soya Chaap", extra: 35, type: "veg", cal: 220 },
    ],
    toppingOptions: [
      { name: "Boondi Raita Pot (150ml)", extra: 25 },
      { name: "Roasted Masala Papad & Green Salad", extra: 20 },
      { name: "Spicy Mango Pickle & Sirka Onions", extra: 15 },
      { name: "Extra Fresh Coriander & Ginger Juliennes", extra: 10 },
    ],
    sauceOptions: [
      { name: "Spicy Mint & Coriander Chutney", extra: 15 },
      { name: "Sweet & Tangy Imli Chutney", extra: 15 },
      { name: "Garlic Red Chilli Dip", extra: 20 },
    ],
    sideOptions: [
      { name: "Warm Gulab Jamun (2 pcs)", extra: 40 },
      { name: "Creamy Kesari Phirni", extra: 45 },
      { name: "Sweet Punjabi Lassi (250ml)", extra: 45 },
      { name: "No Additional Side", extra: 0 },
    ],
  },
  {
    id: "burger_combo",
    name: "Craft Burger & Loaded Box",
    tagline: "Custom stacked burger, golden fries & chilled beverage",
    emoji: "🍔",
    basePrice: 229,
    baseOptions: [
      { name: "Toasted Butter Brioche Bun", extra: 0, cal: 220 },
      { name: "Whole Wheat Multigrain Bun", extra: 20, cal: 180 },
      { name: "Crisp Iceberg Lettuce Wrap (Keto)", extra: 25, cal: 40 },
    ],
    proteinOptions: [
      { name: "Crispy Herb Spiced Potato & Cheese", extra: 0, type: "veg", cal: 230 },
      { name: "Grilled Peri-Peri Cottage Paneer", extra: 35, type: "veg", cal: 260 },
      { name: "Juicy Smoked Chicken Patty", extra: 50, type: "non-veg", cal: 270 },
      { name: "Double Stacked Chicken Supreme", extra: 85, type: "non-veg", cal: 420 },
    ],
    toppingOptions: [
      { name: "Melted Aged Cheddar Cheese Slice", extra: 25 },
      { name: "Caramelized Onions & Pickled Gherkins", extra: 20 },
      { name: "Crispy Bacon Strips", extra: 55 },
      { name: "Fried Sunny Side Egg", extra: 25 },
    ],
    sauceOptions: [
      { name: "Secret Smoky BBQ Sauce", extra: 20 },
      { name: "Spicy Chipotle Aioli", extra: 20 },
      { name: "Creamy Garlic Mayo", extra: 15 },
    ],
    sideOptions: [
      { name: "Crispy Peri-Peri French Fries", extra: 45 },
      { name: "Golden Onion Rings (6 pcs)", extra: 50 },
      { name: "Chilled Vanilla Milkshake", extra: 55 },
      { name: "Chilled Fizzy Soda (300ml)", extra: 30 },
    ],
  },
  {
    id: "pasta_box",
    name: "Artisanal Pasta & Bread Platter",
    tagline: "Handmade gourmet pasta, authentic Italian sauces & toppings",
    emoji: "🍝",
    basePrice: 269,
    baseOptions: [
      { name: "Classic Al Dente Penne Rigate", extra: 0, cal: 220 },
      { name: "Silky Ribbon Fettuccine", extra: 25, cal: 240 },
      { name: "100% Whole Wheat Fusilli", extra: 30, cal: 200 },
    ],
    proteinOptions: [
      { name: "Rich San Marzano Arrabbiata (Red)", extra: 0, type: "veg", cal: 140 },
      { name: "Creamy Parmesan Alfredo (White)", extra: 30, type: "veg", cal: 280 },
      { name: "Pine Nut Basil Pesto (Green)", extra: 40, type: "veg", cal: 260 },
      { name: "Pink Sauce Rosa (Blend)", extra: 35, type: "veg", cal: 220 },
      { name: "Smoked Chicken Bacon Carbonara", extra: 75, type: "non-veg", cal: 360 },
    ],
    toppingOptions: [
      { name: "Shaved Italian Parmesan", extra: 35 },
      { name: "Sautéed Button & Shiitake Mushrooms", extra: 35 },
      { name: "Sun-Dried Tomatoes & Black Olives", extra: 30 },
      { name: "Herb Roasted Chicken Strips", extra: 50 },
    ],
    sauceOptions: [
      { name: "Extra Extra Virgin Olive Oil & Herbs", extra: 15 },
      { name: "Chipotle Dip", extra: 20 },
    ],
    sideOptions: [
      { name: "Cheesy Garlic Herb Bread (3 pcs)", extra: 55 },
      { name: "Molten Choco Lava Cake", extra: 60 },
      { name: "Fresh Lemon Iced Tea", extra: 35 },
      { name: "No Additional Side", extra: 0 },
    ],
  },
];

const CustomMealStudioModal = ({
  isOpen,
  onClose,
  defaultRestaurantId = null,
  defaultRestaurantName = "",
}) => {
  const { addItem, cart } = useCart();
  const { isLogin, user, role } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestId, setSelectedRestId] = useState(defaultRestaurantId);
  const [selectedRestName, setSelectedRestName] = useState(defaultRestaurantName);

  const [currentStep, setCurrentStep] = useState(1); // 1: archetype, 2: base & protein, 3: toppings & sauces, 4: sides & review
  const [selectedMealType, setSelectedMealType] = useState(MEAL_TYPES[0]);

  // Selections
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedProtein, setSelectedProtein] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedSide, setSelectedSide] = useState(null);
  const [spiceLevel, setSpiceLevel] = useState("Medium");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetch active restaurants if not provided
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/public/restaurants");
        const list = res.data?.data || [];
        setRestaurants(list);
        if (!selectedRestId && list.length > 0) {
          // If cart already has a restaurant, default to that
          const matchCart = list.find((r) => r._id === cart?.restaurantId);
          if (matchCart) {
            setSelectedRestId(matchCart._id);
            setSelectedRestName(matchCart.restaurantName);
          } else {
            setSelectedRestId(list[0]._id);
            setSelectedRestName(list[0].restaurantName);
          }
        }
      } catch (e) {
        console.error("Error fetching restaurants for custom meal:", e);
      }
    };
    if (isOpen) {
      fetchRestaurants();
    }
  }, [isOpen, selectedRestId, cart?.restaurantId]);

  // Sync default rest info
  useEffect(() => {
    if (defaultRestaurantId) {
      setSelectedRestId(defaultRestaurantId);
      setSelectedRestName(defaultRestaurantName);
    }
  }, [defaultRestaurantId, defaultRestaurantName]);

  // Reset selections when meal archetype changes
  useEffect(() => {
    if (selectedMealType) {
      setSelectedBase(selectedMealType.baseOptions[0]);
      setSelectedProtein(selectedMealType.proteinOptions[0]);
      setSelectedToppings([]);
      setSelectedSauce(selectedMealType.sauceOptions[0]);
      setSelectedSide(selectedMealType.sideOptions[0]);
      setSpiceLevel("Medium");
      setSpecialInstructions("");
      setQuantity(1);
    }
  }, [selectedMealType]);

  // Calculate live price
  const basePrice = selectedMealType.basePrice;
  const baseExtra = selectedBase?.extra || 0;
  const proteinExtra = selectedProtein?.extra || 0;
  const toppingsExtra = selectedToppings.reduce((sum, t) => sum + (t.extra || 0), 0);
  const sauceExtra = selectedSauce?.extra || 0;
  const sideExtra = selectedSide?.extra || 0;

  const unitTotal = basePrice + baseExtra + proteinExtra + toppingsExtra + sauceExtra + sideExtra;
  const grandTotal = unitTotal * quantity;

  // Approximate calories
  const totalCalories =
    (selectedBase?.cal || 150) +
    (selectedProtein?.cal || 200) +
    selectedToppings.length * 35 +
    (selectedSauce ? 60 : 0) +
    (selectedSide && selectedSide.extra > 0 ? 120 : 0);

  if (!isOpen) return null;

  const handleToggleTopping = (topping) => {
    setSelectedToppings((prev) => {
      const exists = prev.some((t) => t.name === topping.name);
      if (exists) {
        return prev.filter((t) => t.name !== topping.name);
      } else {
        return [...prev, topping];
      }
    });
  };

  const handleAddToCart = () => {
    if (!isLogin || !user) {
      toast.error("Please login to craft and order your custom meal.");
      return;
    }
    if (role !== "user" && role !== "customer") {
      toast.error("Please login as a customer to order food.");
      return;
    }

    if (!selectedRestId) {
      toast.error("Please select a kitchen to prepare your custom meal.");
      return;
    }

    const customDishName = `Custom ${selectedMealType.name} (${selectedProtein?.name || "Crafted"})`;

    const customMealItem = {
      _id: `custom-meal-${selectedMealType.id}-${Date.now()}`,
      itemName: customDishName,
      price: unitTotal,
      category: "Custom Meals",
      foodType: selectedProtein?.type === "non-veg" ? "Non-Vegetarian" : "Vegetarian",
      image: {
        url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      },
      isCustomMealStudio: true,
    };

    const customizationPayload = {
      isCustomized: true,
      size: `Custom ${selectedMealType.name}`,
      baseOrCrust: selectedBase?.name || "",
      spiceLevel: spiceLevel,
      selectedAddOns: [
        { name: `Protein: ${selectedProtein?.name}`, price: proteinExtra },
        ...selectedToppings.map((t) => ({ name: `Topping: ${t.name}`, price: t.extra })),
        ...(selectedSide && selectedSide.name !== "No Additional Side"
          ? [{ name: `Side: ${selectedSide.name}`, price: sideExtra }]
          : []),
      ],
      selectedSauces: selectedSauce
        ? [{ name: selectedSauce.name, price: sauceExtra }]
        : [],
      specialInstructions: specialInstructions.trim() || `Crafted via Meal Studio`,
      customizationPrice: unitTotal - basePrice,
    };

    const res = addItem(
      customMealItem,
      selectedRestId,
      selectedRestName || "Featured Kitchen",
      customizationPayload,
      quantity
    );

    if (res === "different_restaurant") {
      toast.error(
        `Your cart already has items from another restaurant. Please empty your cart or select that kitchen.`
      );
      return;
    }

    toast.success(`🎉 Added "${customDishName}" to cart!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden">
        {/* Modal Top Hero */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white p-5 sm:p-6 flex-shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs transition active:scale-90"
          >
            <IoClose size={20} />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider mb-2 backdrop-blur-xs">
                <TbChefHat size={14} />
                <span>Custom Meal Studio</span>
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
                Build Your Dream Meal
              </h2>
              <p className="text-xs text-orange-100 font-medium">
                Choose every ingredient, customize portion & spice, prepared fresh by our partner kitchen.
              </p>
            </div>

            {/* Kitchen Selector dropdown if not locked */}
            <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-xs border border-white/20 flex-shrink-0">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-orange-200 block mb-1">
                Fulfilling Kitchen
              </label>
              <select
                value={selectedRestId || ""}
                onChange={(e) => {
                  const targetId = e.target.value;
                  setSelectedRestId(targetId);
                  const matched = restaurants.find((r) => r._id === targetId);
                  if (matched) setSelectedRestName(matched.restaurantName);
                }}
                className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1.5 rounded-xl outline-hidden"
              >
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.restaurantName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            {[
              { num: 1, label: "Meal Style" },
              { num: 2, label: "Base & Protein" },
              { num: 3, label: "Toppings & Sauces" },
              { num: 4, label: "Review & Order" },
            ].map((step) => {
              const isPassed = currentStep >= step.num;
              const isCurrent = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-2 text-left py-1.5 px-2 rounded-xl transition ${
                    isCurrent
                      ? "bg-white text-orange-600 font-black shadow-xs"
                      : isPassed
                      ? "bg-white/20 text-white font-bold"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-black ${
                      isCurrent
                        ? "bg-orange-600 text-white"
                        : "bg-white/30 text-white"
                    }`}
                  >
                    {step.num}
                  </span>
                  <span className="text-[11px] truncate hidden sm:inline">
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* STEP 1: Select Meal Archetype */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-heading text-base font-black text-slate-900">
                  Step 1: Choose Your Meal Foundation
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Select what kind of bowl, box, or platter you are craving today
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {MEAL_TYPES.map((type) => {
                  const isSelected = selectedMealType.id === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setSelectedMealType(type);
                        setCurrentStep(2);
                      }}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                        isSelected
                          ? "border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/20 shadow-xs"
                          : "border-slate-200 bg-white hover:border-orange-200 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl flex-shrink-0 shadow-inner">
                        {type.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-heading text-sm font-black text-slate-900">
                            {type.name}
                          </h4>
                          <span className="text-xs font-black text-orange-600">
                            ₹{type.basePrice}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {type.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Base & Protein */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Base Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-100 text-orange-700 text-[10px] font-bold">1</span>
                    <span>Select Foundation Grain / Base</span>
                  </h4>
                  <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                    Pick 1
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedMealType.baseOptions.map((base, idx) => {
                    const isSelected = selectedBase?.name === base.name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedBase(base)}
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
                          <div>
                            <p className="text-xs font-bold text-slate-800">{base.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{base.cal} kcal</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-900">
                          {base.extra > 0 ? `+₹${base.extra}` : "Included"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Protein / Main Filling Selection */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-100 text-orange-700 text-[10px] font-bold">2</span>
                    <span>Choose Main Protein / Star Filling</span>
                  </h4>
                  <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                    Pick 1
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedMealType.proteinOptions.map((protein, idx) => {
                    const isSelected = selectedProtein?.name === protein.name;
                    const isVeg = protein.type === "veg" || protein.type === "vegan";
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedProtein(protein)}
                        className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/70 shadow-xs ring-2 ring-orange-500/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-3.5 w-3.5 items-center justify-center rounded-xs p-0.5 border ${
                              isVeg ? "border-emerald-600" : "border-red-600"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isVeg ? "bg-emerald-600" : "bg-red-600"
                              }`}
                            />
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{protein.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{protein.cal} kcal</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-900">
                          {protein.extra > 0 ? `+₹${protein.extra}` : "Included"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Toppings & Sauces & Spice */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Toppings (Multi-select) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold">🥗</span>
                    <span>Fresh Veggies, Crunch & Toppings</span>
                  </h4>
                  <span className="text-[11px] font-bold text-slate-400">
                    Select any
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedMealType.toppingOptions.map((top, idx) => {
                    const isChecked = selectedToppings.some((t) => t.name === top.name);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleToggleTopping(top)}
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
                            {top.name}
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-amber-700">
                          +₹{top.extra}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dressing / Sauce */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">🥣</span>
                    <span>Select Signature Dressing / Sauce</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedMealType.sauceOptions.map((sauce, idx) => {
                    const isSelected = selectedSauce?.name === sauce.name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSauce(sauce)}
                        className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-800">
                          {sauce.name}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-700">
                          {sauce.extra > 0 ? `+₹${sauce.extra}` : "Included"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spice Level */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="font-heading text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <IoFlame className="text-orange-600 text-sm" />
                  <span>Desired Spice Level</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Mild", "Medium", "Spicy 🌶️", "Fiery Hot 🌶️🌶️"].map((lvl) => {
                    const isSelected = spiceLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSpiceLevel(lvl)}
                        className={`py-2 px-3 rounded-xl border text-center text-xs font-extrabold transition-all ${
                          isSelected
                            ? "border-orange-600 bg-orange-600 text-white shadow-xs"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-orange-300"
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Side / Beverage & Review Summary */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Complimentary Side or Beverage */}
              <div className="space-y-3">
                <h4 className="font-heading text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold">🥤</span>
                  <span>Add Side Dish or Chilled Drink (Optional)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedMealType.sideOptions.map((side, idx) => {
                    const isSelected = selectedSide?.name === side.name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSide(side)}
                        className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-800">
                          {side.name}
                        </span>
                        <span className="text-xs font-extrabold text-indigo-700">
                          {side.extra > 0 ? `+₹${side.extra}` : "Free"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Cooking Note */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="font-heading text-xs font-black uppercase tracking-wider text-slate-900 block">
                  Chef Preparation Instructions
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g., Extra crispy, less oil, pack dressing separately..."
                  className="w-full text-xs font-medium p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              {/* Meal Summary Card */}
              <div className="rounded-2xl bg-orange-50/70 border border-orange-200/80 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-orange-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedMealType.emoji}</span>
                    <div>
                      <h4 className="font-heading text-sm font-black text-slate-900">
                        {selectedMealType.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Kitchen: <strong>{selectedRestName}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-orange-200 text-xs font-black text-orange-700 shadow-xs">
                    <IoNutritionOutline />
                    <span>~{totalCalories} kcal</span>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-slate-700">
                  <p>
                    <strong className="text-slate-900">Base:</strong> {selectedBase?.name}
                  </p>
                  <p>
                    <strong className="text-slate-900">Protein:</strong> {selectedProtein?.name}
                  </p>
                  {selectedToppings.length > 0 && (
                    <p>
                      <strong className="text-slate-900">Toppings:</strong>{" "}
                      {selectedToppings.map((t) => t.name).join(", ")}
                    </p>
                  )}
                  <p>
                    <strong className="text-slate-900">Dressing:</strong> {selectedSauce?.name} •{" "}
                    <strong className="text-slate-900">Spice:</strong> {spiceLevel}
                  </p>
                  {selectedSide && selectedSide.name !== "No Additional Side" && (
                    <p>
                      <strong className="text-slate-900">Side:</strong> {selectedSide.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex items-center justify-between gap-4 shadow-lg flex-shrink-0">
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="flex items-center gap-1 px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition"
              >
                <IoArrowBack />
                <span>Back</span>
              </button>
            )}
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Total Price
              </span>
              <span className="font-heading text-lg sm:text-xl font-black text-slate-900">
                ₹{grandTotal}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                className="flex items-center gap-1.5 rounded-2xl bg-slate-900 px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-slate-800 active:scale-95 transition"
              >
                <span>Continue</span>
                <IoArrowForward />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 transition"
              >
                <IoSparkles size={16} />
                <span>Add Custom Meal to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomMealStudioModal;
