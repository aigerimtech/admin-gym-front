import {mdiEye, mdiTrashCan, mdiPencil, mdiPlus} from "@mdi/js";
import Icon from "@mdi/react";
import Head from "next/head";
import React, {useEffect, useState} from "react";
import CardBox from "../../components/CardBox";
import SectionMain from "../../components/Section/Main";
import SectionTitleLineWithButton from "../../components/Section/TitleLineWithButton";
import {getPageTitle} from "../../config";
import {useAuthStore} from "../../stores/auth/authStore";
import {useAdminStore} from "../../stores/admin/adminStore";
import {User} from "../../stores/admin/adminStore";
import {useSubscriptionStore} from "../../stores/subscription/subscriptionStore";
import {useRouter} from "next/navigation";
import EditUserModal from "../../components/CardBox/Component/EditUserModal";
import {useAttendanceStore} from "../../stores/attendance/attendanceStore";
import MarkAttendanceModal from "../../components/CardBox/Component/MarkAttendanceModal";
import CreateUserModal from "../../components/CardBox/Component/CreateUserModal";

const UsersPage = () => {
    const {fetchUsers, users, deleteUser, updateUser} = useAdminStore();
    const {fetchSubscriptions, subscriptions} = useSubscriptionStore();
    const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
    const {isAuthenticated, isAdmin} = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const perPage = 5;
    const [editUser, setEditUser] = useState<User | null>(null);
    const [isModalActive, setIsModalActive] = useState(false);
    const [attendanceModalActive, setAttendanceModalActive] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const {fetchAttendanceByDate} = useAttendanceStore();
    const [isCreateUserModalActive, setIsCreateUserModalActive] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            await fetchCurrentUser();
            setLoading(false);
        };
        checkAuth();
    }, [fetchCurrentUser]);

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push("/auth/login");
            }
        } else if (!isAdmin) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isAdmin, loading, router]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    const numPages = Math.ceil(users.length / perPage);
    const startIndex = currentPage * perPage;
    const endIndex = startIndex + perPage;
    const displayedUsers = users.slice(startIndex, endIndex);

    const handleEdit = (user: User) => {
        setEditUser(user);
        setIsModalActive(true);
    };

    const handleSaveEdit = async () => {
        if (editUser) {
            try {
                await updateUser(editUser.id, editUser);
                setIsModalActive(false);
                await fetchUsers();
                await fetchSubscriptions();
            } catch (error) {
                console.error("Failed to update user:", error);
            }
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
                        onClick={() => setIsCreateUserModalActive(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1"
                    >
                        <Icon path={mdiPlus} size={0.8}/> Create User
                    </button>
                </SectionTitleLineWithButton>

                <CardBox hasTable>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">#</th>
                            <th className="border p-2">Full Name</th>
                            <th className="border p-2">Phone</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Access Level</th>
                            <th className="border p-2">Role</th>
                            <th className="border p-2">Subscription Type</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {displayedUsers.length > 0 ? (
                            displayedUsers.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="border p-2">{user.id}</td>
                                    <td className="border p-2">{user.first_name} {user.last_name}</td>
                                    <td className="border p-2">{user.phone}</td>
                                    <td className="border p-2">{user.email}</td>
                                    <td className="border p-2">{user.access_level}</td>
                                    <td className="border p-2">{user.role}</td>
                                    <td className="border p-2">{user.subscription?.type ?? "No Subscription"}</td>
                                    <td className="border p-2">
                      <span className={user.status === "active" ? "text-green-500" : "text-red-500"}>
                        {user.status ?? "N/A"}
                      </span>
                                    </td>
                                    <td className="border p-2 flex gap-2">
                                        <button className="text-blue-500 flex items-center gap-1"
                                                onClick={() => handleEdit(user)}>
                                            <Icon path={mdiPencil} size={0.8}/> Edit
                                        </button>
                                        <button
                                            className="text-red-500 flex items-center gap-1"
                                            onClick={() => deleteUser(user.id)}
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

                <div className="p-3 border-t border-gray-100 flex justify-between items-center">
                    <button
                        className="px-3 py-1 border rounded"
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Prev
                    </button>

                    <div className="flex space-x-2">
                        {Array.from({length: numPages}, (_, i) => (
                            <button
                                key={i}
                                className={`px-3 py-1 rounded ${i === currentPage ? "bg-green-500 text-white" : "bg-gray-200"}`}
                                onClick={() => setCurrentPage(i)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        className="px-3 py-1 border rounded"
                        disabled={currentPage === numPages - 1}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </button>

                    <small>Page {currentPage + 1} of {numPages}</small>
                </div>

                <div className="fixed bottom-4 right-4">
                    <button
                        onClick={() => {
                            setSelectedDate(new Date().toISOString().split("T")[0]);
                            handleMarkAttendance();
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1"
                    >
                        <Icon path={mdiPlus} size={0.8}/> Mark Attendance
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

                <CreateUserModal
                    isActive={isCreateUserModalActive}
                    onClose={() => setIsCreateUserModalActive(false)}
                />

            </SectionMain>
        </>
    );
};

export default UsersPage;