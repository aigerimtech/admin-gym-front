import { create } from "zustand";
import { apiClient } from "../api/apiCLient";
import { getToken } from "../utils/token";
import { Subscription, useSubscriptionStore } from "../../stores/subscription/subscriptionStore";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  access_level: "client" | "superadmin";
  status: "active" | "blocked";
  subscription?: Subscription | null;
}

interface AdminState {
  users: User[];
  currentAdmin: User | null;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: number) => Promise<User | null>;
  createUser: (userData: Omit<User, "id" | "status" | "access_level"> & { password: string }) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  updateUser: (id: number, userData: Partial<User>) => Promise<void>;
  updateUserSubscription: (userId: number, subscription: Subscription | null) => void;
  logout: () => void; 
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  currentAdmin: null,

  fetchUsers: async () => {
    const token = getToken();
    if (!token) return;
  
    try {
      const userResponse = await apiClient.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      let users: User[] = userResponse.data; 
  
      const currentAdmin = users.find(user => user.access_level === "superadmin");
      if (!currentAdmin) {
        await useSubscriptionStore.getState().fetchSubscriptions();
        const subscriptions: Subscription[] = useSubscriptionStore.getState().subscriptions as unknown as Subscription[];
  
        if (Array.isArray(subscriptions)) {
          users = users.map((user) => {
            const userSubscription = subscriptions.find((sub) => sub.user?.id === user.id);
            return {
              ...user,
              subscription: userSubscription ?? null,
            };
          });
        }
      } else {
        const subscriptionResponse = await apiClient.get("/subscription/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const subscriptions: Subscription[] = subscriptionResponse.data;
  
        if (Array.isArray(subscriptions)) {
          users = users.map((user) => ({
            ...user,
            subscription: subscriptions.find((sub) => sub.user?.id === user.id) || null,
          }));
        }
      }
  
      set({ users, currentAdmin });
    } catch (error) {
      console.error("Error fetching users or subscriptions:", error);
    }
  },
  
  fetchUserById: async (id) => {
    const token = getToken();
    if (!token) {
      console.warn("No token found, cannot fetch user.");
      return null;
    }

    try {
      const response = await apiClient.get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data;

      await useSubscriptionStore.getState().fetchSubscriptions();
      const subscriptions = useSubscriptionStore.getState().subscription as unknown as Subscription[];
      const userSubscription = Array.isArray(subscriptions)
        ? subscriptions.find((sub) => sub.user?.id === user.id)
        : null;

      return { ...user, subscription: userSubscription ?? null };
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  createUser: async (userData: {
      first_name: string,
      last_name: string, 
      phone: string, 
      email: string, 
      password: string, 
      role: "user" | "admin" 
    }) => {
    const token = getToken();
    if (!token) {
      console.warn("No token found, cannot create user.");
      return;
    }
  
    try {
      const response = await apiClient.post("/users", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const newUser = response.data;
      set((state) => ({
        users: [...state.users, newUser], 
      }));
  
      await useSubscriptionStore.getState().fetchSubscriptions();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  },  

  deleteUser: async (id) => {
    const token = getToken();
    if (!token) {
      console.warn("No token found, cannot delete user.");
      return;
    }

    try {
      await apiClient.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      }));

      await useSubscriptionStore.getState().fetchSubscriptions();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  },

  updateUser: async (id, userData) => {
    const token = getToken();
    if (!token) {
      console.warn("No token found, cannot update user.");
      return;
    }

    try {
      const response = await apiClient.put(`/users/${id}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, ...response.data } : user
        ),
      }));

      await useSubscriptionStore.getState().fetchSubscriptions();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },

  updateUserSubscription: (userId, subscription) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, subscription } : user
      ),
    }));
  },

  logout: () => {
    useSubscriptionStore.getState().resetSubscription();
    set({ currentAdmin: null });
  }
}));
