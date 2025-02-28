import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSubscriptionStore } from "../stores/subscription/subscriptionStore";
import { useAuthStore } from "../stores/auth/authStore";

const SubscriptionsPage = () => {
  const { subscription, processSubscriptionPayment } = useSubscriptionStore();
  const { currentUser } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [subscriptionType, setSubscriptionType] = useState<"monthly" | "quarterly" | "yearly">("monthly");

  useEffect(() => {
    if (currentUser) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleSubscription = async () => {
    if (!currentUser) {
      setPaymentStatus("Please log in to purchase or update a subscription.");
      return;
    }

    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      setPaymentStatus("Please fill in all payment details.");
      return;
    }

    setLoading(true);
    const startDate = new Date();
    let endDate = new Date();

    switch (subscriptionType) {
      case "monthly":
        endDate.setMonth(startDate.getMonth() + 1);
        break;
      case "quarterly":
        endDate.setMonth(startDate.getMonth() + 3);
        break;
      case "yearly":
        endDate.setFullYear(startDate.getFullYear() + 1);
        break;
    }

    const result = await processSubscriptionPayment({
      cardNumber,
      cardHolder,
      expiryDate,
      cvv,
      type: subscriptionType,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      visitsLeft: subscriptionType === "monthly" ? 10 : subscriptionType === "quarterly" ? 30 : 100,
    });

    setPaymentStatus(result.message);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Subscription</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : subscription ? (
        <div className="border p-6 rounded-lg shadow-md bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Your Subscription</h2>
          <p><strong>Type:</strong> {subscription.type}</p>
          <p><strong>Start Date:</strong> {subscription.start_date}</p>
          <p><strong>End Date:</strong> {subscription.end_date}</p>
          <p><strong>Visits Left:</strong> {subscription.visits_left}</p>
          <button onClick={handleSubscription} className="mt-4 w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Update Subscription
          </button>
        </div>
      ) : (
        <p className="text-center">No active subscription found.</p>
      )}

      {currentUser && !subscription && (
        <div className="mt-6 border p-6 rounded-lg shadow-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Enter Payment Details</h2>
          <div className="mb-4">
            <label className="block mb-2">Subscription Type</label>
            <select className="w-full p-2 border rounded" value={subscriptionType} onChange={(e) => setSubscriptionType(e.target.value as any)}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <input className="w-full p-2 mb-2 border rounded" type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
          <input className="w-full p-2 mb-2 border rounded" type="text" placeholder="Card Holder" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} />
          <input className="w-full p-2 mb-2 border rounded" type="text" placeholder="Expiry Date (MM/YY)" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
          <input className="w-full p-2 mb-4 border rounded" type="text" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} />
          <button onClick={handleSubscription} className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Purchase Subscription
          </button>
        </div>
      )}
      {paymentStatus && <p className="mt-4 text-center text-green-600">{paymentStatus}</p>}
      <button onClick={() => router.push("/dashboard")} className="mt-6 w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
        Back to Dashboard
      </button>
    </div>
  );
};

export default SubscriptionsPage;
