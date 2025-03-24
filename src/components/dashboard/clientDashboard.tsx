import { mdiAccountMultiple, mdiCartOutline, mdiChartTimelineVariant, mdiViewDashboard } from "@mdi/js";
import SectionMain from "../Section/Main";
import SectionTitle from "../Section/Title";
import CardBoxWidget from "../CardBox/Widget";
import { useAttendanceStore } from "../../stores/attendance/attendanceStore";
import { useEffect, useState } from "react";
import { useSubscriptionStore } from "../../stores/subscription/subscriptionStore";
import { useUserSessionStore } from "../../stores/sessions/UserSessions";

const ClientDashboard = () => {
    const fetchLastMonthAttendance = useAttendanceStore((state) => state.fetchLastMonthAttendance);
    const fetchSubscription =useSubscriptionStore((state) => state.fetchSubscription);
    const getRegistrations = useUserSessionStore((state) => state.getRegistrations);
    const [data, setData] = useState<any>(null);
    const [subscriptionData, setSubscriptionData] = useState<any>(null);
    const [sessionData, setSessionData] = useState<any>(null);

    useEffect(() => {
      fetchLastMonthAttendance().then((res:any) => {
        setData(res);
      });
      fetchSubscription().then((res:any) => {
        setSubscriptionData(res);
      });
      getRegistrations().then((res:any) => {
        setSessionData(res);
      });
    }, []);


    return (
      <SectionMain>
        <SectionTitle icon={mdiViewDashboard}>Dashboard</SectionTitle>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
      <CardBoxWidget
        trendLabel="Last month"
        trendType="info"
        trendColor="success"
        icon={mdiAccountMultiple}
        iconColor="success"
        number={data?.visits || 0}
        label="Visits"
      />
      <CardBoxWidget
        trendLabel={subscriptionData?.type}
        trendType="success"
        trendColor="light"
        icon={mdiCartOutline}
        iconColor="info"
        number={subscriptionData?.end_date}
        label="Subscription"
      />
    </div>
    <div className="mt-6 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Session Details</h2>
          {sessionData?.length ? (
            <ul className="space-y-2">
              {sessionData.map((session: any, index: number) => (
                <li key={index} className="p-3 bg-gray-100 rounded-md">
                  <p><strong>Session ID:</strong> {session.id}</p>
                  <p><strong>Name:</strong> {session.session.name}</p>
                  <p><strong>Start Time:</strong> {new Date(session.session.start_time).toLocaleString()}</p>
                  <p><strong>End Time:</strong> {new Date(session.session.end_time).toLocaleString()}</p>
                  <p><strong>Capacity:</strong> {session.session.capacity}</p>
                  <p><strong>Available Slots:</strong> {session.session.available_slots}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No sessions available.</p>
          )}
        </div>
      </SectionMain>
    );
  }
  
  export default ClientDashboard;