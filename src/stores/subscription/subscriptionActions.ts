import { apiClient } from "../api/apiCLient";
import { SubscriptionState } from "./subscriptionStore";
import { useAuthStore } from "../auth/authStore"; // Import auth store to get token

type SetState = (partial: Partial<SubscriptionState> | ((state: SubscriptionState) => Partial<SubscriptionState>)) => void;

// Fetch Subscription Status
export const fetchSubscriptionStatus = async (set: SetState) => {
  try {
    const { token } = useAuthStore.getState();
    if (!token) throw new Error("User not authenticated");

    const response = await apiClient.get("/subscription/status", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Ensure subscription data is properly set
    set({ subscription: response.data.subscription || null });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    set({ subscription: null }); // Ensure state is reset if fetching fails
  }
};

// Process Subscription Payment
export const processSubscriptionPayment = async (
  set: SetState,
  paymentData: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    type: "monthly" | "quarterly" | "yearly";
    startDate: string;
    endDate: string;
    visitsLeft: number;
  }
): Promise<string> => {
  try {
    const { token } = useAuthStore.getState();
    if (!token) throw new Error("User not authenticated");

    const response = await apiClient.post(
      "/subscription/pay",
      paymentData,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      }
    );

    set({ subscription: response.data.subscription });

    return response.data.message || "Payment successful and subscription updated";
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) return data.message || "Invalid card details.";
      if (status === 401) return "Unauthorized. Please log in.";
      if (status === 500) return "Server error. Try again later.";
    }
    return "An unknown error occurred.";
  }
};
