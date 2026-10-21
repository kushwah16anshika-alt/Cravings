import axios from "axios";

// In production, fallback to the Render backend URL to prevent loopback CORS blocks
const DEFAULT_API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://cravings-bdyf.onrender.com"
    : "http://localhost:4500";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  withCredentials: true,
});

export default api;