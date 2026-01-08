import axios from "axios";
import { useAuthStore } from "../../store/index";
import { useOfflineStore } from "../../store/index";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors and offline
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If offline, add to queue
    if (!navigator.onLine) {
      const offlineStore = useOfflineStore.getState();
      offlineStore.addToQueue({
        endpoint: error.config.url,
        method: error.config.method.toUpperCase(),
        data: error.config.data ? JSON.parse(error.config.data) : undefined,
      });
      throw new Error("Request queued for when online");
    }

    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      const authStore = useAuthStore.getState();
      authStore.logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Offline queue processor
export const processOfflineQueue = async () => {
  const offlineStore = useOfflineStore.getState();
  const queue = offlineStore.queue;

  for (const item of queue) {
    try {
      await api({
        method: item.method,
        url: item.endpoint,
        data: item.data,
      });
      offlineStore.removeFromQueue(item.id);
    } catch (error) {
      console.error("Failed to process queued request:", error);
    }
  }
};

// Listen for online/offline events
window.addEventListener("online", () => {
  useOfflineStore.getState().setOnlineStatus(true);
  processOfflineQueue();
});

window.addEventListener("offline", () => {
  useOfflineStore.getState().setOnlineStatus(false);
});
