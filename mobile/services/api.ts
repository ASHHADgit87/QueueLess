import axios from "axios";
import { storage } from "../utils/storage";
import { API_URL } from "../utils/constants";

export const TOKEN_KEY = "queueless_token";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await storage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  },
);

export const setStoredToken = (token: string) =>
  storage.setItem(TOKEN_KEY, token);
export const getStoredToken = () => storage.getItem(TOKEN_KEY);
export const clearStoredToken = () => storage.removeItem(TOKEN_KEY);
