import {
    mdiAccountMultiple,
    mdiCartOutline,
    mdiChartTimelineVariant,
    mdiViewList,
  } from '@mdi/js'
  
  import React, { useEffect, useState } from 'react'
import SectionMain from '../Section/Main'
import CardBoxWidget from '../CardBox/Widget'
import SectionTitle from '../Section/Title'
import { useAdminStore } from '../../stores/admin/adminStore'
import { useSubscriptionStore } from '../../stores/subscription/subscriptionStore'
import CardBox from '../CardBox'


const AdminDashboard = () => {
   const fetchCountAllUsers = useAdminStore((state) => state.fetchCountAllUsers);
   const fetchSubscriptions = useSubscriptionStore((state) => state.fetchSubscriptions);
   const subscriptions = useSubscriptionStore((state) => state.subscriptions);
   const [data, setData] = useState<any>(null);

   useEffect(() => {
        fetchCountAllUsers().then((res:any) => {
        setData(res);
        });
        fetchSubscriptions()
    }, []);

  return (
    <>
  <SectionMain>
    <SectionTitle icon={mdiChartTimelineVariant}>
      Dashboard
    </SectionTitle>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
      <CardBoxWidget
        trendLabel="users"
        trendType="info"
        trendColor="success"
        icon={mdiAccountMultiple}
        iconColor="success"
        number={data?.total || 0}
        label="Registered"
      />
      <CardBoxWidget
        trendLabel="subscriptions"
        trendType="info"
        trendColor="warning"
        icon={mdiCartOutline}
        iconColor="info"
        number={subscriptions?.length || 0}
        label="Sales"
      />
    </div>
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
</>);
}

export default AdminDashboard;