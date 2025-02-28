import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { apiClient } from "../api/apiCLient";
import { useAuthStore } from "../auth/authStore";

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
  processSubscriptionPayment: (paymentData: PaymentData) => Promise<{ message: string; subscription: Subscription | null }>;
  resetSubscription: () => void; // ✅ Ensure this function exists
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

        processSubscriptionPayment: async (paymentData) => {
          try {
            const { token } = useAuthStore.getState();
            if (!token) return { message: "Unauthorized. Please log in.", subscription: null };

            console.log("Sending request with token:", token);

            const response = await apiClient.post("/subscription/pay", paymentData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            const subscriptionData: Subscription = response.data.subscription;
            set({ subscription: subscriptionData });
            return { message: response.data.message || "Payment successful and subscription updated", subscription: subscriptionData };
          } catch (error: any) {
            if (error.response) {
              const { status, data } = error.response;
              if (status === 400) return { message: data.message || "Invalid card details.", subscription: null };
              if (status === 401) return { message: "Unauthorized. Please log in.", subscription: null };
              if (status === 500) return { message: "Server error. Try again later.", subscription: null };
            }
            return { message: "An unknown error occurred.", subscription: null };
          }
        },

        // ✅ Reset subscription when user logs out
        resetSubscription: () => set({ subscription: null }),
      }),
      {
        name: "subscription-storage",
      }
    )
  )
);
