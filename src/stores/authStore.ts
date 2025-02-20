import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  access_level: string;
  status: string;
}

interface AuthState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string | null;
  registerUser: (userData: Omit<User, "id" | "role" | "status"> & { password: string }) => Promise<string>;
  login: (credentials: { email: string; password: string }) => Promise<string>;
  logout: () => void;
  fetchUsers: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        users: [],
        currentUser: null,
        isAuthenticated: false,
        token: null,

        registerUser: async (userData) => {
          try {
            const response = await axios.post(`${API_BASE_URL}/auth/register/all`, {
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: userData.email,
              phone: userData.phone,
              password: userData.password,
              access_level: "client",
            });

            if (response.data.id) {
              set((state) => ({ users: [...state.users, response.data] }));
              return "Registration successful!";
            } else {
              return "Registration failed!";
            }
          } catch (error) {
            return "Error registering user!";
          }
        },

        login: async ({ email, password }) => {
          try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });

            if (response.data.access_token) {
              const userResponse = await axios.get(`${API_BASE_URL}/users`, {
                headers: { Authorization: `Bearer ${response.data.access_token}` },
              });

              set({
                currentUser: userResponse.data,
                isAuthenticated: true,
                token: response.data.access_token,
              });

              return "Logged in successfully!";
            } else {
              return "Invalid credentials!";
            }
          } catch (error) {
            return "Login failed!";
          }
        },

        logout: () => set({ currentUser: null, isAuthenticated: false, token: null }),

        fetchUsers: async () => {
          try {
            const { token } = get();
            const response = await axios.get(`${API_BASE_URL}/users`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            set({ users: response.data });
          } catch (error) {
            console.error("Error fetching users:", error);
          }
        },
      }),
      { name: "auth-storage" }
    )
  )
);
