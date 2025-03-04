import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { registerAll, register, loginUser, fetchCurrentUser } from "./authActions";
import { useSubscriptionStore } from "../subscription/subscriptionStore"; 
import { useAdminStore } from "../admin/adminStore";
import { getToken, setToken } from "../utils/token";
import { setAuthHeader } from "../api/apiCLient";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  access_level: "client" | "admin";
  status: "active" | "blocked";
}

export interface AuthState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isAdmin: boolean;

  registerAll: (userData: Omit<User, "id" | "status"> & { password: string }) => Promise<string>;
  register: (userData: Omit<User, "id"> & { password: string; access_level: string }) => Promise<string>;
  loginUser: (credentials: { email: string; password: string }) => Promise<string>;
  logoutUser: () => void;
  fetchUsers: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        users: [],
        currentUser: null,
        isAuthenticated: false,
        token: getToken(),
        isAdmin: false,          

        registerAll: (userData) => registerAll(set, userData),
        register: (userData) => register(set, userData),

        loginUser: async (credentials) => {
          const message = await loginUser(set, get, credentials);
          const state = get();
          if (state.token) {
            setAuthHeader(state.token);
          }
          return message;
        },

        logoutUser: () => {
          set({
            isAuthenticated: false,
            currentUser: null,
            token: null,
            users: [],
            isAdmin: false,
          });

          setToken(null);
          setAuthHeader(null);
          console.log("User logged out, resetting subscriptions...");

          setTimeout(() => {
            useSubscriptionStore.getState().resetSubscription();
          }, 0);
        },

        fetchUsers: async () => {
          if (!get().isAdmin) {
            console.warn("Unauthorized: Only admins can fetch users");
            return;
          }
          await useAdminStore.getState().fetchUsers();
        },

        fetchCurrentUser: async () => {
          const user = await fetchCurrentUser(set);
          if (user) {
            const isAdmin = user.role === "admin" || user.access_level === "admin"; // ✅ Учитываем и role, и access_level
            set({ currentUser: user, isAuthenticated: true, isAdmin });

            if (isAdmin) {
              await useAdminStore.getState().fetchUsers();
            }
          }
        }        
      }),
      {
        name: "auth-storage",
      }
    )
  )
);
