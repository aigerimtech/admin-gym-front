import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { apiClient } from "../api/apiCLient";
import { useAuthStore } from "../auth/authStore";
import { useAdminStore } from "../admin/adminStore";

export interface Subscription {
  id: number | null;
  type: "monthly" | "quarterly" | "yearly" | null;
  start_date: string | null;
  end_date: string | null;
  visits_left: number | null;
  status: "active" | "expired" | "frozen" | null;
  created_at: string | null;
  user: {
    id: number | null;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export interface SubscriptionState {
  subscription: Subscription | null;
  setSubscription: (subscription: Subscription | null) => void;
  fetchSubscriptions: () => Promise<void>;
  processSubscriptionPayment: (paymentData: PaymentData) => Promise<{ message: string; success: boolean }>;
  resetSubscription: () => void;
}

interface PaymentData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  type: "monthly" | "quarterly" | "yearly";
  startDate: string;
  endDate: string;
  visitsLeft: number;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  devtools(
    persist(
      (set) => ({
        subscription: null,
        setSubscription: (subscription) => set({ subscription }),

        fetchSubscriptions: async () => {
          try {
            const { token } = useAuthStore.getState();
            if (!token) return;

            const response = await apiClient.get("http://localhost:3000/subscription/all", {
              headers: { Authorization: `Bearer ${token}` },
            });

            const subscriptionsData: Subscription[] = response.data.subscriptions || [];

            // Attach subscriptions to users in useAdminStore
            useAdminStore.setState((state) => ({
              users: state.users.map((user) => {
                const userSubscription = subscriptionsData.find((sub) => sub.user?.id === user.id);
                return {
                  ...user,
                  subscription: userSubscription || null,
                };
              }),
            }));

            // Set the first subscription as default (or null if none exist)
            set({ subscription: subscriptionsData.length > 0 ? subscriptionsData[0] : null });
          } catch (error) {
            console.error("Error fetching subscriptions:", error);
          }
        },

        processSubscriptionPayment: async (paymentData) => {
          try {
            const { token } = useAuthStore.getState();
            if (!token) throw new Error("User not authenticated");

            const response = await apiClient.post("/subscription/pay", paymentData, {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            const newSubscription: Subscription = response.data.subscription;
            set({ subscription: newSubscription });

            // Refresh subscriptions and users
            await useSubscriptionStore.getState().fetchSubscriptions();
            await useAdminStore.getState().fetchUsers();

            return { message: response.data.message || "Payment successful and subscription updated", success: true };
          } catch (error) {
            return { message: "An error occurred during payment.", success: false };
          }
        },

        resetSubscription: () => set({ subscription: null }),
      }),
      { name: "subscription-storage" }
    )
  )
);
