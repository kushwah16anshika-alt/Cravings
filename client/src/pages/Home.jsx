import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoSearch,
  IoStar,
  IoTimeOutline,
  IoFlame,
  IoSparkles,
  IoHeart,
  IoHeartOutline,
  IoLocationOutline,
  IoShieldCheckmarkOutline,
  IoFlashOutline,
} from "react-icons/io5";
import {
  MdOutlineRestaurantMenu,
  MdDeliveryDining,
  MdArrowForward,
  MdLocalOffer,
} from "react-icons/md";
import { TbChefHat } from "react-icons/tb";

import { useAuth } from "../context/AuthContext";
import api from "../config/api.config";
import Loader from "../components/Loader";
import NoDataFound from "../components/NoDataFound";

// Food Categories with Gen-Z flair
const categories = [
  { id: "all", label: "All Cravings", emoji: "🍽️", count: "100+ items" },
  { id: "pizza", label: "Pizza & Italian", emoji: "🍕", count: "Wood-fired & cheesy" },
  { id: "burger", label: "Burgers & Wraps", emoji: "🍔", count: "Juicy & loaded" },
  { id: "noodles", label: "Noodles & Asian", emoji: "🍜", count: "Spicy & steaming" },
  { id: "meals", label: "Desi Meals & Bowls", emoji: "🍛", count: "Comfort platters" },
  { id: "drinks", label: "Shakes & Boba", emoji: "🥤", count: "Chilled & refreshing" },
  { id: "desserts", label: "Desserts & Bakes", emoji: "🍰", count: "Sweet temptations" },
  { id: "healthy", label: "Salads & Clean", emoji: "🥗", count: "Nutritious & fresh" },
  { id: "cafe", label: "Cafe & Coffee", emoji: "☕", count: "Brewed to perfection" },
];

const perks = [
  {
    icon: <IoFlashOutline className="text-3xl text-orange-600" />,
    title: "Ultra-Fast Delivery",
    desc: "Average 20-minute delivery direct to your dorm, library, or campus gate.",
  },
  {
    icon: <IoShieldCheckmarkOutline className="text-3xl text-emerald-600" />,
    title: "100% Fresh & Hygienic",
    desc: "Strictly verified campus kitchens and sanitized food prep standards.",
  },
  {
    icon: <MdLocalOffer className="text-3xl text-amber-600" />,
    title: "Student-Friendly Deals",
    desc: "Pocket-friendly prices, combo meals, and daily promo discounts.",
  },
];

const testimonials = [
  {
    name: "Aarav Sharma",
    dept: "Computer Science, Year 3",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Aarav",
    quote: "Cravings has saved my exam nights! Hot biryani and burgers right when midnight study sessions peak.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    dept: "Design & Media, Year 2",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Priya",
    quote: "The interface is so smooth and the live order tracking is spot on. Hands down the best campus food app.",
    rating: 5,
  },
  {
    name: "Rohan Verma",
    dept: "Mechanical Engg, Year 4",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rohan",
    quote: "Zero delivery hassles and great local cafe options. The combo deals make it super economical!",
    rating: 5,
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [savedFavorites, setSavedFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cravings_favorites") || "[]");
    } catch {
      return [];
    }
  });

  // Load Restaurants
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const response = await api.get("/public/restaurants");
        const data = response.data?.data || [];

        const formatted = data.map((res) => {
          let cuisines = [];
          if (Array.isArray(res.cuisineType)) {
            cuisines = res.cuisineType;
          } else if (typeof res.cuisineType === "string") {
            cuisines = res.cuisineType.split(",").map((s) => s.trim()).filter(Boolean);
          }

          const image =
            res?.coverImage?.url ||
            res?.images?.[0]?.URL ||
            res?.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80";

          return {
            id: res._id,
            name: res.restaurantName || "Campus Kitchen",
            description: res.description || "Authentic culinary delights and fast campus snacks",
            cuisines: cuisines.length > 0 ? cuisines : ["Multi-Cuisine", "Fast Food"],
            rating: res.averageRating || (4.2 + (res.restaurantName?.length % 7) * 0.1).toFixed(1),
            deliveryTime: res.deliveryTime || "15-25 min",
            costForTwo: res.costForTwo || "₹250 for two",
            image,
            isOpen: res.isOpen !== undefined ? res.isOpen : true,
            isPureVeg: res.isPureVeg || false,
            city: res.address?.city || "Campus Main",
          };
        });

        setRestaurants(formatted);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setSavedFavorites((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("cravings_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  // Filtered Restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((res) => {
      const matchSearch =
        res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.cuisines.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (selectedCategory === "all") return true;
      if (selectedCategory === "pizza") {
        return res.cuisines.some((c) => /pizza|italian|pasta/i.test(c)) || /pizza|italian/i.test(res.name);
      }
      if (selectedCategory === "burger") {
        return res.cuisines.some((c) => /burger|fast|wrap|snack/i.test(c)) || /burger/i.test(res.name);
      }
      if (selectedCategory === "noodles") {
        return res.cuisines.some((c) => /noodle|asian|chinese|thai/i.test(c));
      }
      if (selectedCategory === "meals") {
        return res.cuisines.some((c) => /indian|thali|biryani|meal|rice/i.test(c));
      }
      if (selectedCategory === "drinks") {
        return res.cuisines.some((c) => /beverage|drink|shake|juice|boba/i.test(c));
      }
      if (selectedCategory === "desserts") {
        return res.cuisines.some((c) => /dessert|bakery|cake|sweet|ice cream/i.test(c));
      }
      if (selectedCategory === "healthy") {
        return res.cuisines.some((c) => /healthy|salad|diet/i.test(c)) || res.isPureVeg;
      }
      if (selectedCategory === "cafe") {
        return res.cuisines.some((c) => /cafe|coffee|tea|snack/i.test(c));
      }

      return true;
    });
  }, [restaurants, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-slate-900 overflow-x-hidden">
      {/* =========================================================================
          HERO SECTION
      ========================================================================= */}
      <section className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden">
        {/* Decorative Blurred Glow Orbs */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-orange-400/20 via-amber-300/20 to-red-400/10 blur-[100px] rounded-full" />
        <div className="pointer-events-none absolute top-40 -left-20 w-72 h-72 bg-orange-500/10 blur-[80px] rounded-full" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Highlight Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-extrabold text-orange-700 backdrop-blur-md shadow-xs animate-pulse-subtle">
                <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-ping" />
                <IoSparkles className="text-orange-600" />
                <span>Fastest Campus Food Delivery</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Good food. <br />
                Good mood. <br />
                <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
                  Cravings.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium">
                Discover your next favorite meal from campus cafeterias, artisan cafes, and top local eateries delivered in minutes.
              </p>

              {/* Search Bar */}
              <div className="pt-2 max-w-xl mx-auto lg:mx-0">
                <div className="relative flex items-center rounded-3xl bg-white p-2 shadow-xl shadow-orange-950/5 border border-orange-200/60 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 transition-all duration-300">
                  <div className="pl-3.5 pr-2 text-orange-600">
                    <IoSearch size={22} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pizzas, burgers, biryani, or restaurants..."
                    className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                  />
                  <button
                    onClick={() => navigate("/order-now")}
                    className="flex-shrink-0 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 transition-all"
                  >
                    Find Food
                  </button>
                </div>

                {/* Popular Tags */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-3 text-xs font-semibold text-slate-500">
                  <span className="text-slate-400">Popular:</span>
                  {["🍕 Pizza", "🍔 Burgers", "🍗 Crisp Chicken", "🍛 Biryani", "🥤 Cold Coffee"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag.slice(3))}
                      className="rounded-full bg-orange-50/80 px-2.5 py-1 text-slate-700 border border-orange-100 hover:bg-orange-100 hover:text-orange-700 transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Metric Badges */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 border-t border-slate-200/60">
                <div className="text-left">
                  <p className="font-heading text-2xl font-black text-slate-900">50+</p>
                  <p className="text-xs font-bold text-slate-500">Partner Kitchens</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-left">
                  <p className="font-heading text-2xl font-black text-slate-900">20 Min</p>
                  <p className="text-xs font-bold text-slate-500">Avg. Delivery</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-left">
                  <p className="font-heading text-2xl font-black text-slate-900">4.8 ★</p>
                  <p className="text-xs font-bold text-slate-500">Campus Rating</p>
                </div>
              </div>
            </div>

            {/* Right Visual Floating Elements */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-[40px] bg-gradient-to-tr from-orange-500/10 via-amber-400/20 to-orange-600/10 p-6 flex items-center justify-center border border-white shadow-2xl">
                {/* Center Hero Image Plate */}
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-2xl ring-8 ring-white/80 animate-float-slow">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
                    alt="Delicious Gourmet Burger"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 inset-x-0 text-center text-white font-heading font-extrabold text-lg">
                    Double Smash Burger 🍔
                  </div>
                </div>

                {/* Floating Card 1: Top Rated Pill */}
                <div className="absolute -top-4 -left-4 rounded-2xl glass-card p-3 shadow-lg shadow-black/5 animate-float flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-black">
                    ★
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Top Rated Spot</p>
                    <p className="text-[10px] font-bold text-emerald-600">4.9 (2,400+ reviews)</p>
                  </div>
                </div>

                {/* Floating Card 2: Lightning Delivery */}
                <div className="absolute -bottom-4 -right-4 rounded-2xl glass-card p-3 shadow-lg shadow-black/5 animate-float flex items-center gap-3" style={{ animationDelay: "1.5s" }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white">
                    <MdDeliveryDining size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Swift Delivery</p>
                    <p className="text-[10px] font-bold text-orange-600">⚡ 18-22 mins avg</p>
                  </div>
                </div>

                {/* Floating Card 3: Hot Offer */}
                <div className="absolute top-1/2 -right-8 -translate-y-1/2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 px-3.5 py-2 text-white shadow-lg shadow-orange-600/30 animate-pulse-subtle">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-100">Campus Special</p>
                  <p className="text-xs font-black">20% OFF FIRST ORDER</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          GEN-Z CATEGORY GRID
      ========================================================================= */}
      <section className="py-12 border-y border-orange-500/10 bg-white/60 backdrop-blur-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
                What are you craving?
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Explore Popular Categories
              </h2>
            </div>

            <button
              onClick={() => navigate("/order-now")}
              className="inline-flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700 transition"
            >
              <span>View All Menu</span>
              <MdArrowForward />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group relative flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all duration-200 text-center ${
                    active
                      ? "bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30 scale-105"
                      : "bg-white border border-slate-200/80 text-slate-700 hover:border-orange-200 hover:bg-orange-50/50 hover:scale-102 shadow-xs"
                  }`}
                >
                  <span className="text-3xl mb-1.5 transition-transform group-hover:scale-115">
                    {cat.emoji}
                  </span>
                  <span className={`text-xs font-bold truncate max-w-full ${active ? "text-white" : "text-slate-800"}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED & CURATED RESTAURANTS
      ========================================================================= */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-orange-600">
                <IoFlame className="text-orange-500 text-base" />
                <span>Handpicked for Campus</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Featured Restaurants & Cafes
              </h2>
            </div>

            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-xs font-bold text-orange-600 underline hover:text-orange-700 self-start sm:self-auto"
              >
                Reset Filter
              </button>
            )}
          </div>

          {loading ? (
            <Loader height="300px" text="Fetching freshly updated kitchens..." />
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((restaurant) => {
                const isFav = savedFavorites.includes(restaurant.id);

                return (
                  <div
                    key={restaurant.id}
                    onClick={() => navigate(`/restaurant-details/${restaurant.id}`)}
                    className="group relative flex flex-col rounded-3xl bg-white border border-slate-200/80 shadow-xs card-hover cursor-pointer overflow-hidden"
                  >
                    {/* Cover Image */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                        {/* Veg / Non-veg indicator pill */}
                        <div className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-extrabold backdrop-blur-md shadow-xs">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              restaurant.isPureVeg ? "bg-emerald-500" : "bg-orange-500"
                            }`}
                          />
                          <span className={restaurant.isPureVeg ? "text-emerald-700" : "text-slate-800"}>
                            {restaurant.isPureVeg ? "Pure Veg" : "Multi-Cuisine"}
                          </span>
                        </div>

                        {/* Favorite Bookmark Button */}
                        <button
                          onClick={(e) => toggleFavorite(restaurant.id, e)}
                          title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                          className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition active:scale-90 ${
                            isFav
                              ? "bg-red-500 text-white shadow-md shadow-red-500/30"
                              : "bg-white/85 text-slate-700 hover:text-red-500"
                          }`}
                        >
                          {isFav ? <IoHeart size={16} /> : <IoHeartOutline size={16} />}
                        </button>
                      </div>

                      {/* Bottom Info Bar inside image */}
                      <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white">
                        <div className="flex items-center gap-1 rounded-lg bg-black/40 px-2 py-0.5 text-xs font-bold backdrop-blur-xs">
                          <IoTimeOutline size={14} />
                          <span>{restaurant.deliveryTime}</span>
                        </div>

                        <div className="flex items-center gap-1 rounded-lg bg-amber-500/90 px-2 py-0.5 text-xs font-extrabold text-slate-950 backdrop-blur-xs shadow-xs">
                          <IoStar size={13} className="text-slate-950" />
                          <span>{restaurant.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-heading text-lg font-black text-slate-900 group-hover:text-orange-600 transition truncate">
                            {restaurant.name}
                          </h3>
                        </div>

                        <p className="text-xs font-medium text-slate-500 line-clamp-2 mt-1">
                          {restaurant.description}
                        </p>

                        {/* Cuisine Chips */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {restaurant.cuisines.slice(0, 3).map((cuisine, idx) => (
                            <span
                              key={idx}
                              className="rounded-lg bg-orange-50 px-2 py-0.5 text-[10px] font-extrabold text-orange-700"
                            >
                              {cuisine}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                        <span className="flex items-center gap-1">
                          <IoLocationOutline size={14} className="text-orange-600" />
                          <span>{restaurant.city}</span>
                        </span>

                        <span className="text-orange-600 font-extrabold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                          <span>View Menu</span>
                          <MdArrowForward />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
              <span className="text-5xl">🔍</span>
              <h3 className="font-heading text-xl font-bold text-slate-800 mt-3">
                No matching restaurants found
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Try searching for other dish names or clearing the active category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-600/30 hover:bg-orange-500 transition"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          WHY CRAVINGS / THREE PILLARS
      ========================================================================= */}
      <section className="py-16 bg-gradient-to-b from-white to-orange-50/40 border-t border-orange-500/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
              The Cravings Advantage
            </span>
            <h2 className="font-heading text-3xl font-black text-slate-900 mt-1">
              Built Specifically for Campus Life
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-medium">
              We eliminate canteen queues, unhygienic stalls, and late-night hunger with smart food technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {perks.map((perk, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-orange-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4 inline-flex p-3 rounded-2xl bg-orange-50">
                  {perk.icon}
                </div>
                <h3 className="font-heading text-xl font-black text-slate-900 mb-2">
                  {perk.title}
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          TESTIMONIALS / CAMPUS LOVE
      ========================================================================= */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
              Student Reviews
            </span>
            <h2 className="font-heading text-3xl font-black text-slate-900 mt-1">
              Loved by 500,000+ Foodies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-amber-500 mb-3">
                    {[...Array(t.rating)].map((_, idx) => (
                      <IoStar key={idx} size={16} />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 font-medium italic mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 rounded-xl bg-orange-100 object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{t.name}</h4>
                    <p className="text-[11px] font-semibold text-slate-500">{t.dept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CALL TO ACTION
      ========================================================================= */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[36px] bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-8 sm:p-14 text-white overflow-hidden shadow-2xl shadow-orange-600/30">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md">
                Fast & Hot
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                Ready to beat the hunger?
              </h2>
              <p className="text-sm sm:text-base text-orange-100 font-medium">
                Order your favorite dishes in less than 60 seconds with live order tracking.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/order-now")}
                  className="rounded-2xl bg-white px-7 py-3.5 text-sm font-extrabold text-orange-600 shadow-lg hover:bg-orange-50 active:scale-95 transition"
                >
                  Explore All Menus →
                </button>
                {!user && (
                  <button
                    onClick={() => navigate("/register")}
                    className="rounded-2xl border-2 border-white/80 px-7 py-3.5 text-sm font-extrabold text-white hover:bg-white/10 active:scale-95 transition"
                  >
                    Join Cravings Free
                  </button>
                )}
              </div>
            </div>

            {/* Decorative background shapes */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
              <TbChefHat size={350} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;