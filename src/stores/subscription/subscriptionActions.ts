import { useSubscriptionStore } from "./subscriptionStore";
import { useAuthStore } from "../auth/authStore";
import { apiClient } from "../api/apiCLient";

export const fetchSubscriptionStatus = async () => {
  try {
    const { token } = useAuthStore.getState();
    if (!token) throw new Error("User not authenticated");

    const response = await apiClient.get("/subscription/status", {
      headers: { Authorization: `Bearer ${token}` },
    });

    useSubscriptionStore.setState({ subscription: response.data.subscription || null });
  } catch (error) {
    useSubscriptionStore.setState({ subscription: null });
  }
};

export const processSubscriptionPayment = async (paymentData) => {
  try {
    const { token } = useAuthStore.getState();
    if (!token) throw new Error("User not authenticated");

    const response = await apiClient.post("/subscription/pay", paymentData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    useSubscriptionStore.setState({ subscription: response.data.subscription });

    return response.data.message || "Payment successful and subscription updated";
  } catch (error) {
    return "An error occurred during payment.";
  }
};
