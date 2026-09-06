import express from "express";
import {
  AiSearch,
  GetAiTrendingSuggestions,
} from "../controllers/ai.controller.js";

const router = express.Router();

// AI Natural Language Craving Search
router.post("/search", AiSearch);

// AI Curated Trending Suggestions / Prompt Chips
router.get("/suggestions", GetAiTrendingSuggestions);

export default router;
