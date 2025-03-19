import React, {useEffect} from 'react';
import Head from "next/head";
import {getPageTitle} from "../config";
import SectionMain from "../components/Section/Main";
import {useSubscriptionStore} from "../stores/subscription/subscriptionStore";
import Icon from "@mdi/react";
import {mdiPencil, mdiTrashCan, mdiViewList} from "@mdi/js";
import CardBox from "../components/CardBox";
import SectionTitle from "../components/Section/Title";
import Button from "../components/Button";
import SectionTitleLineWithButton from "../components/Section/TitleLineWithButton";

const Subscriptions = () => {
    const { fetchSubscriptions, subscriptions} = useSubscriptionStore();

    useEffect(() => {
        fetchSubscriptions()
    }, []);
    return (
        <>
            <Head>
                <title>{getPageTitle("Subscriptions")}</title>
            </Head>

            <SectionMain>
                <SectionTitle icon={mdiViewList}>
                    Subscriptions
                </SectionTitle>
                <CardBox hasTable>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">#</th>
                            <th className="border p-2">User Name</th>
                            <th className="border p-2">Type</th>
                            <th className="border p-2">Start Date</th>
                            <th className="border p-2">End Date</th>
                            <th className="border p-2">Visits</th>
                            <th className="border p-2">Created</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {subscriptions.length > 0 ? (
                            subscriptions.map((subscription) => (
                                <tr key={subscription.id} className="border-b">
                                    <td className="border p-2">{subscription.id}</td>
                                    <td className="border p-2">{subscription.user.first_name} {subscription.user.last_name}</td>
                                    <td className="border p-2">{subscription.type}</td>
                                    <td className="border p-2">{subscription.start_date}</td>
                                    <td className="border p-2">{subscription.end_date}</td>
                                    <td className="border p-2">{subscription.visits_left}</td>
                                    <td className="border p-2">{subscription.created_at}</td>
                                    <td className="border p-2">
                      <span className={subscription.status === "active" ? "text-green-500" : "text-red-500"}>
                        {subscription.status ?? "N/A"}
                      </span>
                                    </td>
                                    <td className="border p-2 flex gap-2">
                                        <button className="text-blue-500 flex items-center gap-1" >
                                            <Icon path={mdiPencil} size={0.8}/> Edit
                                        </button>
                                        <button
                                            className="text-red-500 flex items-center gap-1"

                                        >
                                            <Icon path={mdiTrashCan} size={0.8}/> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center p-4">
                                    No users found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </CardBox>
            </SectionMain>
        </>
    );
};

export default Subscriptions;