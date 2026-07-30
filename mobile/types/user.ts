export type UserRole = "customer" | "business" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  pushToken?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}
