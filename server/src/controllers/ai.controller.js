import { GoogleGenAI } from "@google/genai";
import Restaurant from "../models/restaurant.model.js";
import Menu from "../models/menu.model.js";

let aiClient = null;
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

// Curated Dynamic Craving Suggestions
export const GetAiTrendingSuggestions = async (req, res, next) => {
  try {
    const suggestions = [
      {
        id: "sug-1",
        title: "Late-Night Cheesy Treats",
        prompt: "I want cheesy, gooey midnight snacks like loaded pizza or cheese garlic bread under 250",
        icon: "🧀",
        tag: "Midnight Mood",
      },
      {
        id: "sug-2",
        title: "High-Protein Gym Fuel",
        prompt: "High-protein post-workout meal with grilled chicken or paneer, healthy and low oil",
        icon: "💪",
        tag: "Fitness",
      },
      {
        id: "sug-3",
        title: "Rainy Day Comfort Food",
        prompt: "Hot spicy noodles, steaming momos, or warm soup for cozy weather",
        icon: "🌧️",
        tag: "Comfort",
      },
      {
        id: "sug-4",
        title: "Budget Student Meals",
        prompt: "Pocket-friendly lunch thali, rolls, or burger combos under 150",
        icon: "💰",
        tag: "Pocket Friendly",
      },
      {
        id: "sug-5",
        title: "Sweet Dessert Craving",
        prompt: "Delicious cold coffee, chocolate waffles, brownie, or ice cream desserts",
        icon: "🍨",
        tag: "Sweet Tooth",
      },
      {
        id: "sug-6",
        title: "Authentic Spicy Biryani",
        prompt: "Aromatic dum biryani with raita and spicy gravies",
        icon: "🍛",
        tag: "Flavourful",
      },
    ];

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("GetAiTrendingSuggestions Error:", error);
    next(error);
  }
};

// Intelligent Heuristic Fallback Search (Used if Gemini API key is missing or quota is exhausted)
const runFallbackSearch = (query, maxBudget, foodTypePreference, allRestaurants, allMenus) => {
  const q = (query || "").toLowerCase().trim();
  const queryTokens = q.split(/\s+/).filter(Boolean);

  const matchedDishes = [];
  const restaurantScoreMap = new Map();

  for (const menuDoc of allMenus) {
    const restaurant = allRestaurants.find(
      (r) => r._id.toString() === menuDoc.restaurantId?.toString()
    );
    if (!restaurant) continue;

    const availableItems = (menuDoc.menuItems || []).filter(
      (item) => !item.isDeleted && item.status === "available"
    );

    for (const item of availableItems) {
      let score = 0;
      const itemNameLower = (item.itemName || "").toLowerCase();
      const descLower = (item.description || "").toLowerCase();
      const categoryLower = (item.category || "").toLowerCase();
      const itemFoodType = (item.foodType || "").toLowerCase();

      // Budget filter
      if (maxBudget && item.price > maxBudget) {
        continue;
      }

      // Food type preference
      if (foodTypePreference && foodTypePreference !== "all") {
        if (foodTypePreference === "veg" && !itemFoodType.includes("veg")) continue;
        if (foodTypePreference === "non-veg" && itemFoodType.includes("pure veg")) continue;
      }

      // Check token matches
      for (const token of queryTokens) {
        if (itemNameLower.includes(token)) score += 10;
        if (descLower.includes(token)) score += 4;
        if (categoryLower.includes(token)) score += 5;
        if (restaurant.restaurantName.toLowerCase().includes(token)) score += 6;
        if (restaurant.cuisineTypes.some((c) => c.toLowerCase().includes(token))) score += 5;
      }

      // Boost for high rated or recommended
      if (item.isTopRated) score += 2;
      if (item.isRecommended) score += 2;

      // Special food keyword boosts
      if (
        (q.includes("cheese") || q.includes("cheesy")) &&
        (itemNameLower.includes("cheese") || descLower.includes("cheese") || categoryLower.includes("pizza") || categoryLower.includes("burger"))
      ) {
        score += 8;
      }
      if (
        (q.includes("protein") || q.includes("gym") || q.includes("fit")) &&
        (itemNameLower.includes("chicken") || itemNameLower.includes("paneer") || itemNameLower.includes("egg") || itemNameLower.includes("salad"))
      ) {
        score += 8;
      }
      if (
        (q.includes("sweet") || q.includes("dessert") || q.includes("ice cream")) &&
        (categoryLower.includes("dessert") || categoryLower.includes("beverage") || itemNameLower.includes("shake") || itemNameLower.includes("cake"))
      ) {
        score += 8;
      }
      if (
        (q.includes("spicy") || q.includes("chilli") || q.includes("hot")) &&
        (itemNameLower.includes("spicy") || itemNameLower.includes("chilli") || itemNameLower.includes("peri") || descLower.includes("spicy"))
      ) {
        score += 6;
      }

      if (score > 0 || queryTokens.length === 0) {
        matchedDishes.push({
          _id: item._id,
          itemName: item.itemName,
          description: item.description,
          price: item.price,
          category: item.category,
          foodType: item.foodType,
          image: item.image?.url || "",
          restaurantId: restaurant._id,
          restaurantName: restaurant.restaurantName,
          restaurantRating: restaurant.averageRating || 4.2,
          matchReason: `Matches your craving for "${query || item.category}" at ₹${item.price}`,
          score,
        });

        const currentResScore = restaurantScoreMap.get(restaurant._id.toString()) || 0;
        restaurantScoreMap.set(restaurant._id.toString(), currentResScore + score);
      }
    }
  }

  // Sort dishes by relevance score
  matchedDishes.sort((a, b) => b.score - a.score);

  // Top matching restaurants
  const matchedRestaurants = allRestaurants
    .filter((r) => restaurantScoreMap.has(r._id.toString()))
    .map((r) => ({
      _id: r._id,
      restaurantName: r.restaurantName,
      cuisines: r.cuisineTypes,
      city: r.city || "Campus Main",
      averageRating: r.averageRating || 4.2,
      coverImage: r.coverImage?.url || (r.restaurantImage?.[0]?.url || ""),
      restaurantType: r.restaurantType,
      isOpen: r.isOpen,
      matchReason: `Serves popular ${r.cuisineTypes.slice(0, 3).join(", ")} items matching your taste.`,
      score: restaurantScoreMap.get(r._id.toString()),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const topDishes = matchedDishes.slice(0, 8);

  const summary =
    topDishes.length > 0
      ? `Found ${topDishes.length} delicious options matching "${query}" across top campus kitchens!`
      : `Here are some popular recommended picks from our top campus spots.`;

  return {
    aiResponse: summary,
    matchedDishes: topDishes,
    matchedRestaurants,
    suggestedPills: ["Under ₹150", "Extra Cheesy", "Pure Veg", "Quick Delivery", "Spicy Specials"],
    inferredPreferences: {
      budget: maxBudget || "Flexible",
      diet: foodTypePreference || "Any",
      mood: query || "Food Explorer",
    },
  };
};

// AI-Powered Natural Language Craving & Food Search
export const AiSearch = async (req, res, next) => {
  try {
    const { query = "", budget, foodType, cuisine } = req.body;

    if (!query && !budget && !foodType && !cuisine) {
      return res.status(400).json({
        success: false,
        message: "Please provide a craving query or preference.",
      });
    }

    // Fetch all active restaurants
    const allRestaurants = await Restaurant.find({ status: "active" })
      .select("restaurantName cuisineTypes address city state averageRating coverImage restaurantImage restaurantType isOpen servingHours")
      .lean();

    // Fetch all active menu collections
    const allMenus = await Menu.find().lean();

    // Map out catalog summary for AI
    const catalogForAI = [];
    for (const menuDoc of allMenus) {
      const restaurant = allRestaurants.find(
        (r) => r._id.toString() === menuDoc.restaurantId?.toString()
      );
      if (!restaurant) continue;

      const items = (menuDoc.menuItems || [])
        .filter((item) => !item.isDeleted && item.status === "available")
        .map((item) => ({
          dishId: item._id.toString(),
          name: item.itemName,
          desc: item.description,
          price: item.price,
          category: item.category,
          foodType: item.foodType,
          topRated: item.isTopRated,
          restaurantId: restaurant._id.toString(),
          restaurantName: restaurant.restaurantName,
          cuisines: restaurant.cuisineTypes,
        }));

      catalogForAI.push(...items);
    }

    const ai = getAiClient();
    const maxBudget = budget ? Number(budget) : null;

    // If Gemini client is not configured, immediately use intelligent heuristic search
    if (!ai || !process.env.GEMINI_API_KEY) {
      console.log("ℹ️ GEMINI_API_KEY not found or unconfigured. Using smart heuristic search.");
      const fallbackResult = runFallbackSearch(query, maxBudget, foodType, allRestaurants, allMenus);
      return res.status(200).json({
        success: true,
        source: "smart_heuristic",
        data: fallbackResult,
      });
    }

    // Prepare compact catalog payload to optimize token usage
    const compactCatalog = catalogForAI.slice(0, 150).map((item) => ({
      id: item.dishId,
      name: item.name,
      desc: item.desc,
      price: item.price,
      cat: item.category,
      type: item.foodType,
      rId: item.restaurantId,
      rName: item.restaurantName,
    }));

    const systemPrompt = `You are "Chef Crave", the friendly, witty, and highly knowledgeable AI Foodie Sommelier for the Cravings Campus Food Delivery app.
Your job is to analyze the user's craving prompt and match them with the best dishes and restaurants from our LIVE database catalog.

User Query: "${query}"
User Preferences:
- Max Budget: ${maxBudget ? `₹${maxBudget}` : "Flexible"}
- Food Type Preference: ${foodType || "Any"}
- Desired Cuisine: ${cuisine || "Any"}

LIVE MENU CATALOG:
${JSON.stringify(compactCatalog)}

INSTRUCTIONS:
1. Understand the user's craving, mood, health goal, weather context, or budget intent (e.g., late night study snack, comforting soup for a cold, high-protein workout meal, spicy cheese pizza).
2. Select the top matching dishes (up to 8) from the LIVE CATALOG based on the user's intent.
3. For each matched dish, provide a short, appetizing reason why it fits their craving.
4. Select up to 4 matching restaurants from the catalog.
5. Write an enthusiastic, warm 1-2 sentence culinary recommendation summary ("aiResponse").
6. Provide 4-5 quick refinement suggestions/chips ("suggestedPills") that the user might want to click next (e.g., "Add Garlic Bread", "Under ₹150", "Extra Spicy", "Cold Beverages").
7. Output valid JSON only matching the schema below.

JSON SCHEMA:
{
  "aiResponse": "Short foodie message explaining the recommendation",
  "matchedDishIds": [
    {
      "dishId": "string matching catalog id exactly",
      "reason": "Why this dish matches their craving"
    }
  ],
  "matchedRestaurantIds": [
    {
      "restaurantId": "string matching catalog rId exactly",
      "reason": "Why this kitchen is a great choice"
    }
  ],
  "suggestedPills": ["string", "string", "string", "string"],
  "inferredPreferences": {
    "detectedCraving": "string",
    "dietaryType": "string",
    "priceVibe": "string"
  }
}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text?.trim() || "{}";
      const parsed = JSON.parse(responseText);

      // Hydrate dish details from DB data
      const hydratedDishes = (parsed.matchedDishIds || [])
        .map((match) => {
          for (const menuDoc of allMenus) {
            const item = (menuDoc.menuItems || []).find(
              (i) => i._id.toString() === match.dishId
            );
            if (item) {
              const resObj = allRestaurants.find(
                (r) => r._id.toString() === menuDoc.restaurantId?.toString()
              );
              return {
                _id: item._id,
                itemName: item.itemName,
                description: item.description,
                price: item.price,
                category: item.category,
                foodType: item.foodType,
                image: item.image?.url || "",
                restaurantId: resObj?._id,
                restaurantName: resObj?.restaurantName || "Campus Kitchen",
                restaurantRating: resObj?.averageRating || 4.2,
                matchReason: match.reason || `Perfect match for "${query}"`,
              };
            }
          }
          return null;
        })
        .filter(Boolean);

      // Hydrate restaurant details from DB data
      const hydratedRestaurants = (parsed.matchedRestaurantIds || [])
        .map((match) => {
          const resObj = allRestaurants.find(
            (r) => r._id.toString() === match.restaurantId
          );
          if (resObj) {
            return {
              _id: resObj._id,
              restaurantName: resObj.restaurantName,
              cuisines: resObj.cuisineTypes,
              city: resObj.city || "Campus Main",
              averageRating: resObj.averageRating || 4.2,
              coverImage: resObj.coverImage?.url || (resObj.restaurantImage?.[0]?.url || ""),
              restaurantType: resObj.restaurantType,
              isOpen: resObj.isOpen,
              matchReason: match.reason || `Known for great ${resObj.cuisineTypes.slice(0, 2).join(", ")}`,
            };
          }
          return null;
        })
        .filter(Boolean);

      // If AI returned empty matches or low count, blend with heuristic fallback
      if (hydratedDishes.length === 0) {
        const fallback = runFallbackSearch(query, maxBudget, foodType, allRestaurants, allMenus);
        return res.status(200).json({
          success: true,
          source: "gemini_hybrid",
          data: {
            aiResponse: parsed.aiResponse || fallback.aiResponse,
            matchedDishes: fallback.matchedDishes,
            matchedRestaurants: fallback.matchedRestaurants,
            suggestedPills: parsed.suggestedPills || fallback.suggestedPills,
            inferredPreferences: parsed.inferredPreferences || fallback.inferredPreferences,
          },
        });
      }

      res.status(200).json({
        success: true,
        source: "gemini_ai",
        data: {
          aiResponse: parsed.aiResponse,
          matchedDishes: hydratedDishes,
          matchedRestaurants: hydratedRestaurants,
          suggestedPills: parsed.suggestedPills || [
            "Under ₹150",
            "Extra Spicy",
            "Cheesy Favorites",
            "Top Rated",
          ],
          inferredPreferences: parsed.inferredPreferences || {},
        },
      });
    } catch (aiError) {
      console.warn("⚠️ Gemini AI generation error. Falling back to heuristic search:", aiError.message);
      const fallbackResult = runFallbackSearch(query, maxBudget, foodType, allRestaurants, allMenus);
      return res.status(200).json({
        success: true,
        source: "smart_heuristic_fallback",
        data: fallbackResult,
      });
    }
  } catch (error) {
    console.error("AiSearch Controller Error:", error);
    next(error);
  }
};
