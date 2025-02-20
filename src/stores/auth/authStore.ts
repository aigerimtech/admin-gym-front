import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { registerUser, loginUser, logoutUser, fetchUsers } from "./authActions";

// Define the User interface
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  access_level: string;
  status: string;
}

// Define the shape of our Auth store
export interface AuthState {
  // State
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string | null;

  // Actions
  registerUser: (userData: Omit<User, "id" | "role" | "status" | "access_level"> & { password: string }) => Promise<string>;
  loginUser: (credentials: { email: string; password: string }) => Promise<string>;
  logoutUser: () => void;
  fetchUsers: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        users: [],
        currentUser: null,
        isAuthenticated: false,
        token: null,

        // Actions
        registerUser: (userData) => registerUser(set, userData),
        loginUser: (credentials) => loginUser(set, get, credentials),
        logoutUser: () => logoutUser(set),
        fetchUsers: () => fetchUsers(set, get),
      }),
      {
        name: "auth-storage", // name of item in storage
      }
    )
  )
);
