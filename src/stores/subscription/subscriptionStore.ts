import {create} from "zustand";
import {persist, devtools} from "zustand/middleware";
import {apiClient} from "../api/apiCLient";
import {useAuthStore} from "../auth/authStore";
import {useAdminStore} from "../admin/adminStore";

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
        phone: string | null;
    } | null;
}

export interface SubscriptionState {
    subscription: Subscription | null;
    subscriptions: Subscription[];
    setSubscription: (subscription: Subscription | null) => void;
    fetchSubscriptions: () => Promise<void>;
    purchaseSubscription: (paymentData: PaymentData) => Promise<{ message: string; success: boolean }>;
    resetSubscription: () => void;
}

interface PaymentData {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    type: "monthly" | "quarterly" | "yearly";
}

export const useSubscriptionStore = create<SubscriptionState>()(
    devtools(
        persist(
            (set) => ({
                subscription: null,
                subscriptions: [],
                setSubscription: (subscription) => set({subscription}),

                fetchSubscription: async () => {
                    try {
                        const {token} = useAuthStore.getState();

                        if (!token) {
                            console.error("No token found, user not authenticated");
                            return;
                        }

                        const endpoint = "/subscription";

                        const response = await apiClient.get(endpoint, {
                            headers: {Authorization: `Bearer ${token}`},
                        });
                        set({subscription: response.data});
                    } catch (error) {
                        console.error("Error fetching subscriptions:", error);
                    }
                },

                fetchSubscriptions: async () => {
                    try {
                        const {token} = useAuthStore.getState();

                        if (!token) {
                            console.error("No token found, user not authenticated");
                            return;
                        }

                        const endpoint = "/subscription/all";

                        const response = await apiClient.get(endpoint, {
                            headers: {Authorization: `Bearer ${token}`},
                        });
                        set({subscriptions: response.data});
                    } catch (error) {
                        console.error("Error fetching subscriptions:", error);
                    }
                },

                purchaseSubscription: async (paymentData) => {
                    try {
                        const {token} = useAuthStore.getState();
                        if (!token) throw new Error("User not authenticated");

                        const response = await apiClient.post(
                            "/subscription/pay",
                            paymentData,
                            {headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"}}
                        );

                        return {message: response.data.message || "Purchase successful!", success: true};
                    } catch (error: any) {
                        return {
                            message: error?.response?.data?.message || "Error occurred during purchase!",
                            success: false
                        };
                    }
                },

                resetSubscription: () => set({subscription: null, subscriptions: []}),
            }),
            {name: "subscription-storage"}
        )
    )
);