import { api } from "./api";
import { AuthResponse } from "../types/user";
import { LoginFormValues, RegisterFormValues } from "../utils/validation";

export const authService = {
  login: async (values: LoginFormValues): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", values);
    return data;
  },

  register: async (values: RegisterFormValues): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register", values);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getMe: async () => {
    const { data } = await api.get("/users/me");
    return data.user;
  },

  updateProfile: async (payload: {
    name?: string;
    phone?: string;
    pushToken?: string;
  }) => {
    const { data } = await api.patch("/users/me", payload);
    return data.user;
  },

  getHistory: async () => {
    const { data } = await api.get("/users/me/history");
    return data.history;
  },
};
