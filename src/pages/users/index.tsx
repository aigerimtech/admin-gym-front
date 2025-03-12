import { mdiEye, mdiTrashCan, mdiPencil, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import CardBox from "../../components/CardBox";
import SectionMain from "../../components/Section/Main";
import SectionTitleLineWithButton from "../../components/Section/TitleLineWithButton";
import NotificationBar from "../../components/NotificationBar";
import { getPageTitle } from "../../config";
import { useAuthStore } from "../../stores/auth/authStore";
import { useAdminStore } from "../../stores/admin/adminStore";
import { useSubscriptionStore } from "../../stores/subscription/subscriptionStore";
import { useRouter } from "next/navigation";
import EditUserModal from "../../components/CardBox/Component/EditUserModal";
import { useAttendanceStore } from "../../stores/attendance/attendanceStore";
import MarkAttendanceModal from "../../components/CardBox/Component/MarkAttendanceModal";

const UsersPage = () => {
  const { fetchUsers, users, deleteUser, updateUser } = useAdminStore();
  const { fetchSubscriptions, subscriptions } = useSubscriptionStore();
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const { isAuthenticated, isAdmin } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 5;
  const [editUser, setEditUser] = useState(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [attendanceModalActive, setAttendanceModalActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const { fetchAttendanceByDate, attendance } = useAttendanceStore();

  useEffect(() => {
    const checkAuth = async () => {
      await fetchCurrentUser();
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    } else if (!isAdmin) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isAdmin, loading]);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  const numPages = Math.ceil(users.length / perPage);

  const handleEdit = (user) => {
    setEditUser(user);
    setIsModalActive(true);
  };

  const handleSaveEdit = async () => {
    if (editUser) {
      await updateUser(editUser.id, editUser);
      setIsModalActive(false);
      await fetchUsers();
      await fetchSubscriptions();
    }
  };

  const handleMarkAttendance = async () => {
    if (selectedDate) {
      await fetchAttendanceByDate(selectedDate);
    }
    setAttendanceModalActive(true);
  };

  return (
    <>
      <Head>
        <title>{getPageTitle("Users Management")}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiEye} title="Users Management" main>
          <button
            onClick={() => router.push("/users/create")}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1"
          >
            <Icon path={mdiPlus} size={0.8} /> Create User
          </button>
        </SectionTitleLineWithButton>

        <NotificationBar color="info">Manage users efficiently.</NotificationBar>

        <CardBox hasTable>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">Full Name</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Subscription Type</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2">End Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length > 0 ? (
                subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-b">
                    <td className="border p-2">{subscription.user.id}</td>
                    <td className="border p-2">{subscription.user.first_name} {subscription.user.last_name}</td>
                    <td className="border p-2">{subscription.user.phone}</td>
                    <td className="border p-2">{subscription.user.email}</td>
                    <td className="border p-2">{subscription?.type ?? "No Subscription"}</td>
                    <td className="border p-2">{subscription ? subscription.start_date : "No Subscription"}</td>
                    <td className="border p-2">{subscription ? subscription.end_date : "No Subscription"}</td>
                    <td className="border p-2">
                      <span className={subscription?.status === "active" ? "text-green-500" : "text-red-500"}>{subscription ? subscription.status : "N/A"}</span>
                    </td>
                    <td className="border p-2 flex gap-2">
                      <button
                        className="text-blue-500 flex items-center gap-1"
                        onClick={() => handleEdit(subscription.user)}
                      >
                        <Icon path={mdiPencil} size={0.8} /> Edit
                      </button>
                      <button
                        className="text-red-500 flex items-center gap-1"
                        onClick={() => deleteUser(subscription.user.id)}
                      >
                        <Icon path={mdiTrashCan} size={0.8} /> Delete
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

        <div className="p-3 border-t border-gray-100 flex justify-between items-center">
          <div className="flex space-x-2">
            {Array.from({ length: numPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded ${i === currentPage ? "bg-gray-200" : "bg-transparent"}`}
                onClick={() => setCurrentPage(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <small>
            Page {currentPage + 1} of {numPages}
          </small>
        </div>

        {/* Mark Attendance Button at Bottom-Right Corner */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => {
              setSelectedDate(new Date().toISOString().split("T")[0]);
              handleMarkAttendance();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1"
          >
            <Icon path={mdiPlus} size={0.8} /> Mark Attendance
          </button>
        </div>

        <MarkAttendanceModal
          isActive={attendanceModalActive}
          onClose={() => setAttendanceModalActive(false)}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <EditUserModal
          isActive={isModalActive}
          user={editUser}
          onSave={handleSaveEdit}
          onClose={() => setIsModalActive(false)}
          setUser={setEditUser}
        />
      </SectionMain>
    </>
  );
};

export default UsersPage;
