import { apiFetch } from "@/lib/api-client";
import type { AuthResponse, LoginRequest, RegisterRequest, UserDto } from "@/types/auth";

export const authService = {
  login(payload: LoginRequest) {
    return apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: payload
    });
  },

  register(payload: RegisterRequest) {
    return apiFetch<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: payload
    });
  },

  me() {
    return apiFetch<UserDto>("/api/auth/me");
  },

  logout() {
    return apiFetch<void>("/api/auth/logout", {
      method: "POST"
    });
  }
};
