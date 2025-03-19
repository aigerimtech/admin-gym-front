import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { apiClient, setAuthHeader } from "../api/apiCLient";
import { useSubscriptionStore } from "../subscription/subscriptionStore";
import { useAdminStore } from "../admin/adminStore";
import { getToken, setToken } from "../utils/token";

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
        isAuthenticated: !!getToken(),
        token: getToken(),
        isAdmin: false,

        registerAll: async (userData) => {
          try {
            const response = await apiClient.post("/auth/register/all", userData);
            if (response.status === 201) {
              await get().fetchCurrentUser();
              return "Registration successful!";
            }
            return "Registration failed!";
          } catch (error: any) {
            console.error("Registration error:", error?.response?.data);
            return error?.response?.data?.message || "Error registering user!";
          }
        },

        register: async (userData) => {
          const token = getToken();
          if (!token) return "Unauthorized: Please log in first.";
          try {
            const response = await apiClient.post("/auth/register", userData, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 201) {
              await useAdminStore.getState().fetchUsers();
              return "Admin registration successful!";
            }
            return "Admin registration failed!";
          } catch (error: any) {
            console.error("Admin Registration error:", error?.response?.data);
            return error?.response?.data?.message || "Error registering admin!";
          }
        },

        loginUser: async ({ email, password }) => {
          try {
            const response = await apiClient.post("/auth/login", { email, password });
            const { access_token } = response.data;
            if (access_token) {
              setToken(access_token);
              setAuthHeader(access_token);
              set({ token: access_token, isAuthenticated: true });
              await get().fetchCurrentUser();
              return "Logged in successfully!";
            }
            return "Invalid credentials!";
          } catch (error: any) {
            console.error("Login error:", error?.response?.data);
            return error?.response?.data?.message || "Login failed!";
          }
        },

        logoutUser: () => {
          setToken(null); 
          setAuthHeader(null); 
          set({
            currentUser: null,
            isAuthenticated: false,
            token: null,
            users: [],
            isAdmin: false,
          });
        
          useSubscriptionStore.getState().resetSubscription();
          localStorage.removeItem("subscription-storage");
        },        

        fetchCurrentUser: async () => {
          try {
            const token = getToken();
            if (!token) {
              console.error("No token found, user is unauthorized.");
              return;
            }
            
            const response = await apiClient.get("/users/profile", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const user = response.data;
            const isAdmin = user.role === "admin" || user.access_level === "admin";
            set({ currentUser: user, isAuthenticated: true, isAdmin });
          } catch (error) {
            console.error("Failed to fetch user profile:", error);
            set({token: null})
          }
        },

        fetchUsers: async () => {
          if (!get().isAdmin) return console.warn("Unauthorized: Only admins can fetch users");
          await useAdminStore.getState().fetchUsers();
        }
      }),
      { name: "auth-storage" }
    )
  )
);
