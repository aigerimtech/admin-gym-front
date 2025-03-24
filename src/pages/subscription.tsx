import React, { useState, useEffect } from "react";
import { mdiViewList, mdiCashMultiple } from "@mdi/js";
import CardBox from "../components/CardBox";
import NotificationBar from "../components/NotificationBar";
import SectionMain from "../components/Section/Main";
import { getPageTitle } from "../config";
import { useSubscriptionStore } from "../stores/subscription/subscriptionStore";
import Head from "next/head";
import SectionTitle from "../components/Section/Title";
import Image from "next/image";

const SubscriptionTypes = ["monthly", "quarterly", "yearly"];

const SubscriptionPage = () => {
  const { purchaseSubscription } = useSubscriptionStore();

  const [selectedSubscription, setSelectedSubscription] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [cardNumber, setCardNumber] = useState<string | null>(null);
  const [expiry, setExpiry] = useState<string | null>(null);
  const [cvv, setCvv] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  const handlePurchaseSubscription = async () => {
    if (!selectedSubscription) {
      alert("Please select a subscription type.");
      return;
    } else if (!cardNumber || !expiry || !cvv || !name) {
      alert("Please fill in all fields.");
      return;
    } else {
      const paymentData = {    
        cardNumber,
        cardHolder: name,
        expiryDate: expiry,
        cvv,
        type: selectedSubscription,  
      };
      const response = await purchaseSubscription(paymentData);
      if (response.success) {
        alert('successfully purchased subscription');
      }
    }
  }

  
  return (
    <>
      <Head>
        <title>{getPageTitle("Subscription")}</title>
      </Head>

      <SectionMain>
        <SectionTitle icon={mdiViewList}>
          Subscriptions
        </SectionTitle>

        <NotificationBar color="info" icon={mdiViewList}>
          <b>Manage your subscriptions.</b> View and update plans.
        </NotificationBar>

        <CardBox className="p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-10 text-center">Subscription Details</h2>

            <div className="flex flex-col items-center w-full gap-5">
              <div className="flex items-center w-full mb-20">
                <select
                  name="subscriptionType"
                  value={selectedSubscription}
                  onChange={(e) => setSelectedSubscription(e.target.value as any)}
                  className="form-select w-1/3 mr-2"
                >
                  {SubscriptionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </select>
                <div className="w-96 h-56 m-auto bg-red-100 rounded-xl relative text-white shadow-2xl transition-transform transform ml-auto">
              
                <img className="relative object-cover w-full h-full rounded-xl" src="https://i.imgur.com/kGkSg1v.png" alt="img:photo"/>
              
                <div className="w-full px-8 absolute top-8">
                    <div className="flex justify-between">
                        <div className="">
                            <p className="font-light">
                                Name
                            </p>
                            <input onChange={(e) => setName(e.target.value)} placeholder="Karthik P" className="font-medium tracking-widest bg-transparent border-none p-0 m-0 outline-none placeholder:text-[#dad9d9]" />
                        </div>
                        <img className="w-14 h-14" src="https://i.imgur.com/bbPHJVe.png" alt="img:photo"/>
                    </div>
                    <div className="pt-1">
                        <p className="font-light">
                            Card Number
                        </p>
                        <input onChange={(e) => setCardNumber(e.target.value)} placeholder="4642348998677632" className="font-medium tracking-wider bg-transparent border-none p-0 m-0 outline-none placeholder:text-[#dad9d9]" />
                    </div>
                    <div className="pt-6 pr-6">
                        <div className="flex justify-between">
                            <div className="">
                                <p className="font-light text-xs">
                                Expiry
                                </p>
                                <input onChange={(e) => setExpiry(e.target.value)} placeholder="11/15" className="font-medium text-sm tracking-wider bg-transparent border-none p-0 m-0 outline-none placeholder:text-[#dad9d9]" />
                            </div>

                            <div className="">
                                <p className="font-light text-xs">
                                    CVV
                                </p>
                                <input onChange={(e) => setCvv(e.target.value)} type="password" placeholder="..." className="font-light text-xs  bg-transparent border-none p-0 m-0 outline-none placeholder:text-[#dad9d9]" />
                            </div>
                        </div>
                    </div>

                </div>
                </div>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1" onClick={() => {handlePurchaseSubscription()}}>Pay for Subscription</button>
            </div>
            
        </CardBox>
      </SectionMain>
    </>
  );
};

export default SubscriptionPage;
