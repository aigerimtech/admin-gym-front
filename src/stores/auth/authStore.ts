import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { registerAll, register, loginUser, logoutUser, fetchUsers, fetchCurrentUser } from "./authActions";
import { useSubscriptionStore } from "../subscription/subscriptionStore"; // ✅ Adjust the path if necessary

// Define the User interface
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role?: string; // Admin only
  access_level?: string; // Admin only
  status?: string; // Admin only
}

// Define the shape of our Auth store
export interface AuthState {
  // State
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string | null;

  // Actions
  registerAll: (userData: Omit<User, "id" | "role" | "status" | "access_level"> & { password: string }) => Promise<string>;
  register: (userData: Omit<User, "id" | "role" | "status"> & { password: string; access_level: string }) => Promise<string>;
  loginUser: (credentials: { email: string; password: string }) => Promise<string>;
  logoutUser: () => void;
  fetchUsers: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || null;
  }
  return null;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        users: [],
        currentUser: null,
        isAuthenticated: false,
        token: getToken(), 

        registerAll: (userData) => registerAll(set, userData), // Public registration
        register: (userData) => register(set, userData), // Admin registration
        loginUser: async (credentials) => {
          const message = await loginUser(set, get, credentials);
          return message;
        },
        logoutUser: () => {
          set({ 
            isAuthenticated: false, 
            currentUser: null, 
            token: null,
            users: [], 
          });
        
          localStorage.removeItem("token"); 
          console.log("User logged out, resetting subscriptions...");
        
          setTimeout(() => {
            useSubscriptionStore.getState().resetSubscription(); 
          }, 0);
        },
        fetchUsers: () => fetchUsers(set, get),
        fetchCurrentUser: async () => {
          const user = await fetchCurrentUser(set);
          if (user) {
            set({ currentUser: user, isAuthenticated: true });
          }
        },
      }),
      {
        name: "auth-storage", 
      }
    )
  )
);
