import React, { useState } from "react";
import { useRouter } from "next/router";
import { mdiViewList, mdiCashMultiple } from "@mdi/js";
import Head from "next/head";
import Button from "../components/Button";
import CardBox from "../components/CardBox";
import LayoutAuthenticated from "../layouts/Authenticated";
import NotificationBar from "../components/NotificationBar";
import SectionMain from "../components/Section/Main";
import SectionTitleLineWithButton from "../components/Section/TitleLineWithButton";
import { getPageTitle } from "../config";
import { useSubscriptionStore } from "../stores/subscription/subscriptionStore";
import { useAuthStore } from "../stores/auth/authStore";

const SubscriptionsPage = () => {
  const { subscription, processSubscriptionPayment } = useSubscriptionStore();
  const { currentUser } = useAuthStore();
  const router = useRouter();

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    subscriptionType: "monthly" as "monthly" | "quarterly" | "yearly",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubscription = async () => {
    if (!currentUser) {
      setPaymentStatus("Please log in to purchase or update a subscription.");
      return;
    }

    const { cardNumber, cardHolder, expiryDate, cvv, subscriptionType } = formData;

    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      setPaymentStatus("Please fill in all payment details.");
      return;
    }

    const startDate = new Date();
    const endDate = new Date();
    if (subscriptionType === "monthly") endDate.setMonth(startDate.getMonth() + 1);
    else if (subscriptionType === "quarterly") endDate.setMonth(startDate.getMonth() + 3);
    else endDate.setFullYear(startDate.getFullYear() + 1);

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
  };

  return (
    <>
      <Head>
        <title>{getPageTitle("Subscriptions")}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton icon={mdiViewList} title="Subscriptions" main>
          <Button
            href="/subscribe"
            icon={mdiCashMultiple}
            label="New Subscription"
            color="success"
            roundedFull
            small
          />
        </SectionTitleLineWithButton>

        <NotificationBar color="info" icon={mdiViewList}>
          <b>Manage your subscriptions.</b> View and update plans.
        </NotificationBar>

        <CardBox className="p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Subscription Details</h2>

          {subscription ? (
            <div className="border p-6 rounded-lg bg-gray-100 shadow-md">
              <h3 className="text-lg font-semibold">Your Subscription</h3>
              <p><strong>Type:</strong> {subscription.type}</p>
              <p><strong>Start Date:</strong> {subscription.start_date}</p>
              <p><strong>End Date:</strong> {subscription.end_date}</p>
              <p><strong>Visits Left:</strong> {subscription.visits_left}</p>
              <button
                onClick={handleSubscription}
                className="mt-4 w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Update Subscription
              </button>
            </div>
          ) : (
            <>
              <p className="text-center">No active subscription found.</p>

              {currentUser && (
                <div className="mt-6 border p-6 rounded-lg bg-gray-50 shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Enter Payment Details</h3>

                  <label className="block mb-2">Subscription Type</label>
                  <select
                    className="w-full p-2 border rounded mb-4"
                    name="subscriptionType"
                    value={formData.subscriptionType}
                    onChange={handleChange}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>

                  <input
                    className="w-full p-2 border rounded mb-2"
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={handleChange}
                  />
                  <input
                    className="w-full p-2 border rounded mb-2"
                    type="text"
                    name="cardHolder"
                    placeholder="Card Holder"
                    value={formData.cardHolder}
                    onChange={handleChange}
                  />
                  <input
                    className="w-full p-2 border rounded mb-2"
                    type="text"
                    name="expiryDate"
                    placeholder="Expiry Date (MM/YY)"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                  <input
                    className="w-full p-2 border rounded mb-4"
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={handleChange}
                  />

                  <button
                    onClick={handleSubscription}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Purchase Subscription
                  </button>
                </div>
              )}
            </>
          )}

          {paymentStatus && <p className="mt-4 text-center text-green-600">{paymentStatus}</p>}

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </CardBox>
      </SectionMain>
    </>
  );
};


export default SubscriptionsPage;
