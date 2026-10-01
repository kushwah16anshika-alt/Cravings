import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoSparkles,
  IoCheckmarkCircle,
  IoFlame,
  IoNutritionOutline,
  IoArrowBack,
  IoStorefrontOutline,
  IoAdd,
  IoRemove,
} from "react-icons/io5";
import { TbChefHat } from "react-icons/tb";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../config/api.config";
import Loader from "../components/Loader";

const MEAL_ARCHETYPES = [
  {
    id: "bowl",
    name: "Power Fitness Bowl",
    tagline: "High protein, wholesome grains & crisp greens",
    emoji: "🥗",
    basePrice: 249,
    bgGradient: "from-emerald-500/20 to-teal-500/10",
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
    bgGradient: "from-amber-500/20 to-orange-500/10",
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
    bgGradient: "from-orange-500/20 to-red-500/10",
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
    bgGradient: "from-rose-500/20 to-amber-500/10",
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

const CustomMealStudio = () => {
  const navigate = useNavigate();
  const { addItem, cart } = useCart();
  const { isLogin, user, role } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestId, setSelectedRestId] = useState(null);
  const [selectedRestName, setSelectedRestName] = useState("");

  const [selectedType, setSelectedType] = useState(MEAL_ARCHETYPES[0]);
  const [selectedBase, setSelectedBase] = useState(MEAL_ARCHETYPES[0].baseOptions[0]);
  const [selectedProtein, setSelectedProtein] = useState(MEAL_ARCHETYPES[0].proteinOptions[0]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedSauce, setSelectedSauce] = useState(MEAL_ARCHETYPES[0].sauceOptions[0]);
  const [selectedSide, setSelectedSide] = useState(MEAL_ARCHETYPES[0].sideOptions[0]);
  const [spiceLevel, setSpiceLevel] = useState("Medium");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await api.get("/public/restaurants");
        const list = res.data?.data || [];
        setRestaurants(list);
        if (list.length > 0) {
          const match = list.find((r) => r._id === cart?.restaurantId) || list[0];
          setSelectedRestId(match._id);
          setSelectedRestName(match.restaurantName);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load restaurant options");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [cart?.restaurantId]);

  const handleSelectType = (type) => {
    setSelectedType(type);
    setSelectedBase(type.baseOptions[0]);
    setSelectedProtein(type.proteinOptions[0]);
    setSelectedToppings([]);
    setSelectedSauce(type.sauceOptions[0]);
    setSelectedSide(type.sideOptions[0]);
  };

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

  // Price calculations
  const basePrice = selectedType.basePrice;
  const baseExtra = selectedBase?.extra || 0;
  const proteinExtra = selectedProtein?.extra || 0;
  const toppingsExtra = selectedToppings.reduce((sum, t) => sum + (t.extra || 0), 0);
  const sauceExtra = selectedSauce?.extra || 0;
  const sideExtra = selectedSide?.extra || 0;

  const unitTotal = basePrice + baseExtra + proteinExtra + toppingsExtra + sauceExtra + sideExtra;
  const grandTotal = unitTotal * quantity;

  const totalCalories =
    (selectedBase?.cal || 150) +
    (selectedProtein?.cal || 200) +
    selectedToppings.length * 35 +
    (selectedSauce ? 60 : 0) +
    (selectedSide && selectedSide.extra > 0 ? 120 : 0);

  const handleAddToCart = () => {
    if (!isLogin || !user) {
      toast.error("Please login to craft and order your custom meal.");
      navigate("/login");
      return;
    }
    if (role !== "user" && role !== "customer") {
      toast.error("Please login as a customer to order food.");
      return;
    }

    if (!selectedRestId) {
      toast.error("Please select a kitchen to fulfill your custom meal.");
      return;
    }

    const customDishName = `Custom ${selectedType.name} (${selectedProtein?.name || "Crafted"})`;

    const customMealItem = {
      _id: `custom-meal-${selectedType.id}-${Date.now()}`,
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
      size: `Custom ${selectedType.name}`,
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
        `Your cart already has items from another restaurant. Please checkout or empty cart first.`
      );
      return;
    }

    toast.success(`🎉 Custom meal added to cart!`);
    navigate("/cart");
  };

  if (loading) {
    return <Loader height="80vh" width="100%" text="Initializing Custom Meal Studio..." />;
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 transition"
            >
              <IoArrowBack size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600 text-sm font-bold">
                  <TbChefHat size={18} />
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-orange-600">
                  Meal Customizer Studio
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
                Design Your Perfect Meal
              </h1>
            </div>
          </div>

          {/* Kitchen Selector Pill */}
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 flex-shrink-0">
              <IoStorefrontOutline size={18} />
            </div>
            <div className="min-w-0 pr-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Fulfilling Kitchen
              </label>
              <select
                value={selectedRestId || ""}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedRestId(id);
                  const matched = restaurants.find((r) => r._id === id);
                  if (matched) setSelectedRestName(matched.restaurantName);
                }}
                className="text-xs font-black text-slate-900 bg-transparent outline-hidden cursor-pointer"
              >
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.restaurantName} ({r.city})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2-Column Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Ingredient Builder */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Foundation Archetype Carousel / Grid */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-sm font-black text-slate-900 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-600 text-white text-[10px] font-black">1</span>
                  <span>Select Meal Category</span>
                </h3>
                <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                  Step 1 of 5
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MEAL_ARCHETYPES.map((type) => {
                  const isSelected = selectedType.id === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleSelectType(type)}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${
                        isSelected
                          ? "border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/20 shadow-xs scale-[1.01]"
                          : "border-slate-200 bg-white hover:border-orange-200"
                      }`}
                    >
                      <span className="text-3xl">{type.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-heading text-xs font-black text-slate-900">
                            {type.name}
                          </h4>
                          <span className="text-xs font-extrabold text-orange-600">
                            ₹{type.basePrice}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                          {type.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Base Grains / Breads */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="font-heading text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-600 text-white text-[10px] font-black">2</span>
                <span>Choose Foundation Base / Carb</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedType.baseOptions.map((base, idx) => {
                  const isSelected = selectedBase?.name === base.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedBase(base)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/20 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-orange-600 bg-orange-600 text-white"
                              : "border-slate-300"
                          }`}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{base.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{base.cal} kcal</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900">
                        {base.extra > 0 ? `+₹${base.extra}` : "Included"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Main Protein / Filling */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="font-heading text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-600 text-white text-[10px] font-black">3</span>
                <span>Choose Main Protein / Star Ingredient</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedType.proteinOptions.map((protein, idx) => {
                  const isSelected = selectedProtein?.name === protein.name;
                  const isVeg = protein.type === "veg" || protein.type === "vegan";
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedProtein(protein)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/20 shadow-xs"
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
                          <p className="text-xs font-bold text-slate-900">{protein.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{protein.cal} kcal</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900">
                        {protein.extra > 0 ? `+₹${protein.extra}` : "Included"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Fresh Veggies & Toppings */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-sm font-black text-slate-900 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-600 text-white text-[10px] font-black">4</span>
                  <span>Fresh Veggies & Toppings</span>
                </h3>
                <span className="text-[11px] font-bold text-slate-400">
                  Select Multiple
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedType.toppingOptions.map((top, idx) => {
                  const isChecked = selectedToppings.some((t) => t.name === top.name);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleToggleTopping(top)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
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
                              : "border-slate-300"
                          }`}
                        >
                          {isChecked && <IoCheckmarkCircle size={14} />}
                        </div>
                        <span className="text-xs font-bold text-slate-800">{top.name}</span>
                      </div>
                      <span className="text-xs font-black text-amber-700">+₹{top.extra}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Sauces, Sides & Chef Instructions */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
              <h3 className="font-heading text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-600 text-white text-[10px] font-black">5</span>
                <span>Signature Dressing, Sides & Spice</span>
              </h3>

              {/* Dressing */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700">Signature Dressing / Sauce</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedType.sauceOptions.map((sauce, idx) => {
                    const isSelected = selectedSauce?.name === sauce.name;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedSauce(sauce)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-800">{sauce.name}</span>
                        <span className="text-xs font-black text-emerald-700">
                          {sauce.extra > 0 ? `+₹${sauce.extra}` : "Included"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spice Level Row */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                  <IoFlame className="text-orange-600" />
                  <span>Spice Level</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Mild", "Medium", "Spicy 🌶️", "Fiery Hot 🌶️🌶️"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSpiceLevel(lvl)}
                      className={`py-2 px-3 rounded-xl border text-xs font-black transition ${
                        spiceLevel === lvl
                          ? "border-orange-600 bg-orange-600 text-white shadow-xs"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Side / Drink */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700">Optional Side or Chilled Drink</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedType.sideOptions.map((side, idx) => {
                    const isSelected = selectedSide?.name === side.name;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedSide(side)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-800">{side.name}</span>
                        <span className="text-xs font-black text-indigo-700">
                          {side.extra > 0 ? `+₹${side.extra}` : "Free"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Cooking Note */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-black text-slate-700">Kitchen Cooking Note</label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g., Less oil, extra crispy, dressing on the side..."
                  className="w-full text-xs font-medium p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Sticky Summary Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-3xl shadow-inner">
                    {selectedType.emoji}
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-black text-slate-900">
                      {selectedType.name}
                    </h3>
                    <p className="text-xs font-bold text-orange-600 flex items-center gap-1">
                      <IoStorefrontOutline />
                      <span>{selectedRestName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-800 border border-emerald-100">
                  <IoNutritionOutline />
                  <span>~{totalCalories} kcal</span>
                </div>
              </div>

              {/* Itemized Ingredients Breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span>Base: {selectedBase?.name}</span>
                  <span className="font-bold text-slate-900">
                    {selectedBase?.extra > 0 ? `+₹${selectedBase.extra}` : "Included"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Protein: {selectedProtein?.name}</span>
                  <span className="font-bold text-slate-900">
                    {selectedProtein?.extra > 0 ? `+₹${selectedProtein.extra}` : "Included"}
                  </span>
                </div>

                {selectedToppings.map((t, idx) => (
                  <div key={idx} className="flex justify-between text-amber-800">
                    <span>+ {t.name}</span>
                    <span className="font-bold">+₹{t.extra}</span>
                  </div>
                ))}

                <div className="flex justify-between">
                  <span>Dressing: {selectedSauce?.name}</span>
                  <span className="font-bold text-slate-900">
                    {selectedSauce?.extra > 0 ? `+₹${selectedSauce.extra}` : "Included"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Spice Level: {spiceLevel}</span>
                  <span className="font-bold text-emerald-600">Free</span>
                </div>

                {selectedSide && selectedSide.name !== "No Additional Side" && (
                  <div className="flex justify-between text-indigo-800">
                    <span>Side: {selectedSide.name}</span>
                    <span className="font-bold">+₹{selectedSide.extra}</span>
                  </div>
                )}
              </div>

              {/* Total & Action */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Quantity
                  </span>
                  <div className="flex items-center gap-3 bg-slate-100 rounded-full px-3 py-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="text-slate-600 hover:text-orange-600 font-bold transition active:scale-90"
                    >
                      <IoRemove size={16} />
                    </button>
                    <span className="font-heading font-black text-sm text-slate-900 w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      className="text-slate-600 hover:text-orange-600 font-bold transition active:scale-90"
                    >
                      <IoAdd size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-heading text-base font-black text-slate-900">
                    Meal Price
                  </span>
                  <span className="font-heading text-2xl font-black text-orange-600">
                    ₹{grandTotal}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 transition"
                >
                  <IoSparkles size={18} />
                  <span>Add Custom Meal to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomMealStudio;
