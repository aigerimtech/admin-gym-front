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
  newUser: Omit<User, "id" | "role" | "status"> & { password: string };
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string | null;
  setNewUser: (updates: Partial<Omit<User, "id" | "role" | "status"> & { password: string }>) => void;
  registerUser: () => Promise<string>;
  login: (credentials: { email: string; password: string }) => Promise<string>;
  logout: () => void;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: number) => Promise<User | null>;
  updateUser: (id: number, updates: Partial<User>) => Promise<string>;
  deleteUser: (id: number) => Promise<string>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        newUser: {
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          password: "",
          access_level: "client", // ✅ Fix: Added default value
        },
        users: [],
        currentUser: null,
        isAuthenticated: false,
        token: null,

        setNewUser: (updates) =>
          set((state) => ({
            newUser: { ...state.newUser, ...updates },
          })),

        registerUser: async () => {
          try {
            const { newUser } = get();
            const response = await axios.post(`${API_BASE_URL}/auth/register/all`, {
              first_name: newUser.first_name,
              last_name: newUser.last_name,
              email: newUser.email,
              phone: newUser.phone,
              password: newUser.password,
              access_level: newUser.access_level, // ✅ Fix: Ensure access_level is included
            });

            if (response.data.id) {
              set({
                newUser: {
                  first_name: "",
                  last_name: "",
                  email: "",
                  phone: "",
                  password: "",
                  access_level: "client",
                },
              });
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
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
              email,
              password,
            });

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

        fetchUserById: async (id) => {
          try {
            const { token } = get();
            const response = await axios.get(`${API_BASE_URL}/users/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            return response.data;
          } catch (error) {
            console.error("Error fetching user by ID:", error);
            return null;
          }
        },

        updateUser: async (id, updates) => {
          try {
            const { token } = get();
            const response = await axios.put(`${API_BASE_URL}/users/${id}`, updates, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.id) {
              return "User updated successfully!";
            } else {
              return "Update failed!";
            }
          } catch (error) {
            return "Error updating user!";
          }
        },

        deleteUser: async (id) => {
          try {
            const { token } = get();
            await axios.delete(`${API_BASE_URL}/users/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            return "User deleted successfully!";
          } catch (error) {
            return "Error deleting user!";
          }
        },
      }),
      { name: "auth-storage" }
    )
  )
);
