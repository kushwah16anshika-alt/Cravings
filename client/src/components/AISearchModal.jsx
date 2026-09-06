import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../config/api.config.js";
import toast from "react-hot-toast";

import {
  IoSparkles,
  IoSearch,
  IoClose,
  IoMic,
  IoMicOff,
  IoFastFoodOutline,
  IoStar,
  IoArrowForward,
  IoRestaurantOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
} from "react-icons/io5";
import { FiTrendingUp, FiShoppingBag, FiDollarSign } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const AISearchModal = ({ isOpen, onClose, initialQuery = "" }) => {
  const navigate = useNavigate();
  const { addItem, replaceCart } = useCart();

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("all");

  const [trendingSuggestions, setTrendingSuggestions] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cravings_ai_recents")) || [];
    } catch {
      return [];
    }
  });

  const [conflictModalItem, setConflictModalItem] = useState(null);

  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync initial query
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      fetchTrendingSuggestions();
    } else {
      stopVoiceInput();
    }
  }, [isOpen]);

  // Keyboard shortcut (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        toast("🎙️ Listening... Tell me your food craving!", {
          icon: "✨",
          duration: 3000,
        });
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuery(transcript);
          handleSearch(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (err) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
        toast.error("Could not capture voice. Please try typing.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!speechSupported) {
      toast.error("Voice search is not supported on this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn("Recognition start error:", err);
      }
    }
  };

  const stopVoiceInput = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Fetch AI Trending Prompts
  const fetchTrendingSuggestions = async () => {
    try {
      const res = await api.get("/ai/suggestions");
      if (res.data?.success && res.data?.data) {
        setTrendingSuggestions(res.data.data);
      }
    } catch {
      // Fallback curated chips
      setTrendingSuggestions([
        {
          id: "1",
          title: "Late-Night Cheesy Treats",
          prompt: "Cheesy loaded pizza and garlic bread under 250",
          icon: "🧀",
        },
        {
          id: "2",
          title: "High-Protein Fuel",
          prompt: "High-protein grilled chicken or paneer post-workout meal",
          icon: "💪",
        },
        {
          id: "3",
          title: "Comforting Hot Soup & Momos",
          prompt: "Warm soothing soup and steamed spicy momos",
          icon: "🌧️",
        },
        {
          id: "4",
          title: "Pocket-Friendly Combos",
          prompt: "Budget lunch roll or burger combo under 150",
          icon: "💰",
        },
      ]);
    }
  };

  // Execute AI Search
  const handleSearch = async (searchPrompt = query, budget = selectedBudget, diet = selectedDiet) => {
    const finalQuery = (searchPrompt || "").trim();
    if (!finalQuery && !budget && diet === "all") {
      toast.error("Please enter a craving or select a prompt!");
      return;
    }

    setLoading(true);
    setAiResult(null);

    // Save to recents
    if (finalQuery) {
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== finalQuery.toLowerCase());
        const updated = [finalQuery, ...filtered].slice(0, 6);
        localStorage.setItem("cravings_ai_recents", JSON.stringify(updated));
        return updated;
      });
    }

    try {
      const res = await api.post("/ai/search", {
        query: finalQuery,
        budget: budget ? Number(budget) : undefined,
        foodType: diet !== "all" ? diet : undefined,
      });

      if (res.data?.success && res.data?.data) {
        setAiResult(res.data.data);
      } else {
        toast.error("Could not find matching dishes. Try another craving!");
      }
    } catch (error) {
      console.error("AI Search Error:", error);
      toast.error(error.response?.data?.message || "AI search is momentarily busy. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (promptText) => {
    setQuery(promptText);
    handleSearch(promptText);
  };

  const handleRefinePillClick = (pill) => {
    const newQuery = `${query} ${pill}`.trim();
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  const handleAddToCart = (dish) => {
    const itemData = {
      _id: dish._id,
      itemName: dish.itemName,
      price: dish.price,
      image: { url: dish.image },
      category: dish.category,
      foodType: dish.foodType,
    };

    const status = addItem(itemData, dish.restaurantId, dish.restaurantName);
    if (status === "added") {
      toast.success(`Added ${dish.itemName} to cart! 🛒`);
    } else if (status === "different_restaurant") {
      setConflictModalItem({
        item: itemData,
        restaurantId: dish.restaurantId,
        restaurantName: dish.restaurantName,
      });
    }
  };

  const handleConfirmReplaceCart = () => {
    if (conflictModalItem) {
      replaceCart(
        conflictModalItem.item,
        conflictModalItem.restaurantId,
        conflictModalItem.restaurantName
      );
      toast.success(
        `Cart updated with ${conflictModalItem.item.itemName} from ${conflictModalItem.restaurantName}!`
      );
      setConflictModalItem(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl my-6 rounded-3xl bg-white shadow-2xl border border-orange-500/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Glowing Accent */}
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner border border-white/30 text-amber-200">
              <IoSparkles className="text-xl animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight font-heading">
                  Chef Crave AI Assistant
                </h2>
                <span className="rounded-full bg-amber-400/30 border border-amber-300/40 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-100">
                  Smart Search
                </span>
              </div>
              <p className="text-xs text-orange-100 font-medium">
                Type your craving, mood, budget, or dietary goal in plain words
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 transition active:scale-95"
            aria-label="Close modal"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Search Bar & Filters Section */}
        <div className="p-4 sm:p-6 bg-slate-50/80 border-b border-slate-200 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="relative flex items-center rounded-2xl bg-white p-2 shadow-md shadow-orange-950/5 border-2 border-orange-400/40 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 transition-all"
          >
            <div className="pl-3 pr-2 text-orange-600">
              <IoSearch size={22} />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 'Craving spicy paneer rolls under ₹150' or 'Warm soup for cold rainy day'..."
              className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
            />

            {/* Voice Search Button */}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30"
                    : "text-slate-400 hover:text-orange-600 hover:bg-orange-50"
                }`}
                title={isListening ? "Listening... Click to stop" : "Search with Voice"}
              >
                {isListening ? <IoMic size={20} /> : <IoMic size={20} />}
              </button>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex-shrink-0 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-md shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <HiOutlineSparkles size={16} />
                  <span>Ask AI</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Dietary Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-400">Diet:</span>
              {[
                { label: "All", val: "all" },
                { label: "🌱 Pure Veg", val: "veg" },
                { label: "🍗 Non-Veg", val: "non-veg" },
              ].map((diet) => (
                <button
                  key={diet.val}
                  type="button"
                  onClick={() => {
                    setSelectedDiet(diet.val);
                    if (query) handleSearch(query, selectedBudget, diet.val);
                  }}
                  className={`rounded-xl px-2.5 py-1 font-bold border transition ${
                    selectedDiet === diet.val
                      ? "bg-orange-600 border-orange-600 text-white shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:border-orange-300"
                  }`}
                >
                  {diet.label}
                </button>
              ))}
            </div>

            {/* Budget Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-400">Max Budget:</span>
              {[
                { label: "Any", val: "" },
                { label: "₹150", val: "150" },
                { label: "₹250", val: "250" },
                { label: "₹400", val: "400" },
              ].map((b) => (
                <button
                  key={b.val}
                  type="button"
                  onClick={() => {
                    setSelectedBudget(b.val);
                    if (query) handleSearch(query, b.val, selectedDiet);
                  }}
                  className={`rounded-xl px-2.5 py-1 font-bold border transition ${
                    selectedBudget === b.val
                      ? "bg-amber-600 border-amber-600 text-white shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:border-amber-300"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Loading Animation */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 animate-spin flex items-center justify-center p-1">
                  <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                    <IoSparkles className="text-2xl text-orange-500 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-heading font-black text-slate-800 text-base">
                  Chef Crave is cooking up recommendations...
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Analyzing campus menus, spices, prices, and reviews
                </p>
              </div>
            </div>
          )}

          {/* AI RESULTS SECTION */}
          {!loading && aiResult && (
            <div className="space-y-6 animate-fade-in">
              {/* Chef Commentary Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-4 border border-orange-200/80 shadow-xs flex items-start gap-3.5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white shadow-md shadow-orange-600/20">
                  <IoSparkles size={20} />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-orange-800">
                      Chef Crave's Recommendation
                    </span>
                    {aiResult.inferredPreferences?.detectedCraving && (
                      <span className="rounded-full bg-orange-200/60 px-2 py-0.5 text-[10px] font-bold text-orange-800">
                        {aiResult.inferredPreferences.detectedCraving}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {aiResult.aiResponse}
                  </p>
                </div>
              </div>

              {/* Matched Dishes */}
              {aiResult.matchedDishes && aiResult.matchedDishes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <IoFastFoodOutline className="text-orange-600" />
                      <span>Matching Dishes ({aiResult.matchedDishes.length})</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-400">
                      1-Click Add to Cart
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {aiResult.matchedDishes.map((dish) => (
                      <div
                        key={dish._id}
                        className="group relative flex flex-col justify-between rounded-2xl bg-white p-3.5 border border-slate-200 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-950/5 transition-all duration-200"
                      >
                        <div className="flex gap-3">
                          {/* Dish Image or Food Icon */}
                          <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            {dish.image ? (
                              <img
                                src={dish.image}
                                alt={dish.itemName}
                                className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-orange-50 text-orange-400 font-black text-xl">
                                🍽️
                              </div>
                            )}
                            <div className="absolute top-1 left-1">
                              <span
                                className={`inline-block h-2.5 w-2.5 rounded-full border border-white ${
                                  dish.foodType?.toLowerCase().includes("veg")
                                    ? "bg-emerald-500"
                                    : "bg-red-500"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Dish Info */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-bold text-slate-900 text-sm truncate">
                                {dish.itemName}
                              </h4>
                              <span className="font-extrabold text-orange-600 text-sm whitespace-nowrap">
                                ₹{dish.price}
                              </span>
                            </div>

                            <p className="text-[11px] font-semibold text-slate-500 truncate flex items-center gap-1">
                              <IoRestaurantOutline size={12} className="text-slate-400" />
                              <span>{dish.restaurantName}</span>
                            </p>

                            <p className="text-[11px] text-amber-700 bg-amber-50 rounded-md px-1.5 py-0.5 line-clamp-2 font-medium border border-amber-100">
                              ✨ {dish.matchReason}
                            </p>
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              onClose();
                              navigate(`/restaurant-details/${dish.restaurantId}`);
                            }}
                            className="text-[11px] font-bold text-slate-500 hover:text-orange-600 flex items-center gap-1 transition"
                          >
                            <span>View Restaurant</span>
                            <IoArrowForward size={11} />
                          </button>

                          <button
                            onClick={() => handleAddToCart(dish)}
                            className="flex items-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-95 px-3 py-1.5 text-xs font-black text-white shadow-xs shadow-orange-600/20 transition"
                          >
                            <FiShoppingBag size={13} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Restaurants */}
              {aiResult.matchedRestaurants && aiResult.matchedRestaurants.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-heading font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <IoRestaurantOutline className="text-orange-600" />
                    <span>Recommended Campus Kitchens</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {aiResult.matchedRestaurants.map((res) => (
                      <div
                        key={res._id}
                        onClick={() => {
                          onClose();
                          navigate(`/restaurant-details/${res._id}`);
                        }}
                        className="cursor-pointer group flex items-center gap-3.5 rounded-2xl bg-slate-50 p-3 border border-slate-200 hover:border-orange-400 hover:bg-white transition-all shadow-xs"
                      >
                        <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden border border-orange-200">
                          {res.coverImage ? (
                            <img
                              src={res.coverImage}
                              alt={res.restaurantName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <IoRestaurantOutline size={20} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-orange-600 transition">
                              {res.restaurantName}
                            </h4>
                            <span className="flex items-center gap-0.5 text-xs font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                              <IoStar size={11} className="text-amber-500 fill-amber-500" />
                              <span>{res.averageRating || 4.2}</span>
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate font-medium">
                            {res.cuisines?.slice(0, 3).join(", ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Refinement Pills */}
              {aiResult.suggestedPills && aiResult.suggestedPills.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 mb-2">
                    Refine with 1-click:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {aiResult.suggestedPills.map((pill, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRefinePillClick(pill)}
                        className="rounded-full bg-orange-50 border border-orange-200/80 px-3 py-1 text-xs font-bold text-orange-700 hover:bg-orange-100 hover:border-orange-300 transition"
                      >
                        + {pill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INITIAL STATE: Trending Craving Prompts & Recent Searches */}
          {!loading && !aiResult && (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Recent Craving Searches
                    </span>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem("cravings_ai_recents");
                      }}
                      className="text-[11px] font-bold text-slate-400 hover:text-red-500 transition"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((rec, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuery(rec);
                          handleSearch(rec);
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 px-3 py-1.5 text-xs font-semibold text-slate-700 transition"
                      >
                        <IoTimeOutline size={13} className="text-slate-400" />
                        <span>{rec}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Prompts */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="text-orange-600" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Trending Campus Cravings (Click to Try)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {trendingSuggestions.map((sug) => (
                    <button
                      key={sug.id}
                      onClick={() => handlePromptClick(sug.prompt)}
                      className="group text-left p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200/80 hover:border-orange-300 transition-all duration-200 shadow-2xs hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="text-xl">{sug.icon || "✨"}</span>
                        <span className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition">
                          {sug.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 font-medium">
                        "{sug.prompt}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span>Connected to Live Campus Menus</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Press <kbd className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">ESC</kbd> to close</span>
          </div>
        </div>
      </div>

      {/* Cart Conflict Modal */}
      {conflictModalItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 text-2xl mx-auto">
              ⚠️
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-heading font-black text-slate-900 text-lg">
                Start a New Cart?
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Your cart currently contains items from a different restaurant. Would you like to clear it and add <strong>{conflictModalItem.item.itemName}</strong> from <strong>{conflictModalItem.restaurantName}</strong>?
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setConflictModalItem(null)}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReplaceCart}
                className="flex-1 rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-600/30 hover:bg-orange-500 transition"
              >
                Yes, Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISearchModal;
