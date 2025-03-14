import React, { useState, useEffect } from "react";
import { mdiViewList, mdiCashMultiple } from "@mdi/js";
import Button from "../components/Button";
import CardBox from "../components/CardBox";
import NotificationBar from "../components/NotificationBar";
import SectionMain from "../components/Section/Main";
import SectionTitleLineWithButton from "../components/Section/TitleLineWithButton";
import { getPageTitle } from "../config";
import { useSubscriptionStore } from "../stores/subscription/subscriptionStore";
import { useAuthStore } from "../stores/auth/authStore";
import { useAdminStore } from "../stores/admin/adminStore"; // Import admin store
import Head from "next/head";

const SubscriptionsPage = () => {
  const { subscription, fetchSubscriptions, purchaseSubscription, setSubscription, resetSubscription } = useSubscriptionStore();
  const { currentUser } = useAuthStore();
  const { currentAdmin } = useAdminStore(); 

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    subscriptionType: "monthly" as "monthly" | "quarterly" | "yearly",
  });

  const [isPaymentFormVisible, setPaymentFormVisible] = useState(false);
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardHolder: "",
    cvv: "",
    expiryDate: "",
  });

  useEffect(() => {
    if (currentUser) {
      if (currentAdmin) {
        resetSubscription();
      } else {
        fetchSubscriptions();
      }
    }
  }, [currentUser, currentAdmin, fetchSubscriptions, resetSubscription]);

  useEffect(() => {
    if (!subscription && currentUser) {
      setPaymentFormVisible(true);
    } else if (subscription && subscription.status === 'active') {
      setPaymentFormVisible(false); 
    }
  }, [subscription, currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setFormData({ ...formData, cardNumber: value });
    if (value.length > 0 && value.length !== 16) {
      setErrors({ ...errors, cardNumber: "Card number must be 16 digits." });
    } else {
      setErrors({ ...errors, cardNumber: "" });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setFormData({ ...formData, cvv: value });
    if (value.length > 0 && value.length !== 3) {
      setErrors({ ...errors, cvv: "CVV must be 3 digits." });
    } else {
      setErrors({ ...errors, cvv: "" });
    }
  };

  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\d/g, "");
    setFormData({ ...formData, cardHolder: value });
    if (/\d/.test(value)) {
      setErrors({ ...errors, cardHolder: "Cardholder name cannot contain numbers." });
    } else {
      setErrors({ ...errors, cardHolder: "" });
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setFormData({ ...formData, expiryDate: value });
    if (value.length === 4 && !/^\d{2}\/\d{2}$/.test(value)) {
      setErrors({ ...errors, expiryDate: "Please enter a valid expiry date in MM/YY format." });
    } else {
      setErrors({ ...errors, expiryDate: "" });
    }
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

    const visitsLeft = subscriptionType === "monthly" ? 10 : subscriptionType === "quarterly" ? 30 : 100;

    const result = await purchaseSubscription({
      cardNumber,
      cardHolder,
      expiryDate,
      cvv,
      type: subscriptionType,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      visitsLeft,
    });

    if (result.success) {
      const updatedSubscription = {
        ...subscription,
        type: subscriptionType,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        visits_left: visitsLeft,
      };

      setSubscription(updatedSubscription);
    }

    setPaymentStatus(result.message);
    setPaymentFormVisible(false);
  };

  return (
    <>
      <Head>
        <title>{getPageTitle("Subscriptions")}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton icon={mdiViewList} title="Subscriptions" main>
          {subscription && !currentAdmin && (
            <Button
              onClick={() => setPaymentFormVisible(true)}
              icon={mdiCashMultiple}
              label="Update Subscription"
              color="success"
              roundedFull
              small
              className="hover:bg-green-700 transition-all duration-300 ease-in-out"
            />
          )}
        </SectionTitleLineWithButton>

        <NotificationBar color="info" icon={mdiViewList}>
          <b>Manage your subscriptions.</b> View and update plans.
        </NotificationBar>

        <CardBox className="p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Subscription Details</h2>

          {subscription ? (
            <>
              <div className="border p-6 rounded-lg bg-gray-100 shadow-md mb-4 hover:shadow-lg transition-all duration-300 ease-in-out">
                <h3 className="text-lg font-semibold">Your Current Subscription</h3>
                <p><strong>Type:</strong> {subscription.type}</p>
                <p><strong>Start Date:</strong> {subscription.start_date}</p>
                <p><strong>End Date:</strong> {subscription.end_date}</p>
                <p><strong>Visits Left:</strong> {subscription.visits_left}</p>
              </div>
              <p>Want to change your subscription type or number of visits? Press <span className="font-semibold text-blue-600">&quot;Update Subscription&quot;</span>.</p>
            </>
          ) : (
            <p className="text-center mb-4">No active subscription found. Please enter payment details below.</p>
          )}

          {isPaymentFormVisible && !subscription && currentUser && !currentAdmin && (
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
                className={`w-full p-2 border rounded mb-2 ${errors.cardNumber ? 'border-red-500' : ''}`}
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
              />
              {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}

              <input
                className={`w-full p-2 border rounded mb-2 ${errors.cardHolder ? 'border-red-500' : ''}`}
                type="text"
                name="cardHolder"
                placeholder="Card Holder"
                value={formData.cardHolder}
                onChange={handleCardHolderChange}
              />
              {errors.cardHolder && <p className="text-red-500 text-sm">{errors.cardHolder}</p>}

              <input
                className={`w-full p-2 border rounded mb-2 ${errors.expiryDate ? 'border-red-500' : ''}`}
                type="text"
                name="expiryDate"
                placeholder="Expiry Date (MM/YY)"
                value={formData.expiryDate}
                onChange={handleExpiryDateChange}
              />
              {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}

              <input
                className={`w-full p-2 border rounded mb-2 ${errors.cvv ? 'border-red-500' : ''}`}
                type="text"
                name="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={handleCvvChange}
              />
              {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}

              <Button
                onClick={handleSubscription}
                label="Submit Payment"
                color="success"
                roundedFull
                small
                className="mt-4 w-full"
              />
              <p className="text-center text-green-600 mt-4">{paymentStatus}</p>
            </div>
          )}
        </CardBox>
      </SectionMain>
    </>
  );
};

export default SubscriptionsPage;
