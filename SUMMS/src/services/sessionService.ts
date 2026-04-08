import type Client from "../types/user";

const CURRENT_USER_KEY = "currentUser";

function getCurrentUser(): Client | null {
  const saved = localStorage.getItem(CURRENT_USER_KEY);
  return saved ? JSON.parse(saved) : null;
}

function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function getDashboardRoute(): string {
  const user = getCurrentUser();

  if (!user) return "/";
  if (user.role === "admin") return "/admin-dashboard";
  if (user.role === "provider") return "/provider";
  return "/home";
}

export const sessionService = {
  getCurrentUser,
  logout,
  getDashboardRoute,
};