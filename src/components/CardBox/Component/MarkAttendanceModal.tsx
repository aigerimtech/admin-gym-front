import React, { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiMagnify, mdiCheckCircle, mdiCloseCircle } from "@mdi/js";
import { useAttendanceStore } from "../../../stores/attendance/attendanceStore";
import { useAdminStore } from "../../../stores/admin/adminStore";
import { apiClient, setAuthHeader } from "../../../stores/api/apiCLient";
import { getToken } from "../../../stores/utils/token";

interface MarkAttendanceModalProps {
  isActive: boolean;
  onClose: () => void;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}

const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({
  isActive,
  onClose,
  selectedDate,
  setSelectedDate,
}) => {
  const { attendance, fetchAttendanceByDate, markAttendance } = useAttendanceStore();
  const { users, fetchUsers } = useAdminStore();
  const [searchName, setSearchName] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setAuthHeader(getToken());
    fetchUsers();
    if (selectedDate) fetchAttendanceByDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (searchName.trim()) {
      const filtered = users.filter(user =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchName.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchName, users]);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setSearchName("");
    setFilteredUsers([]);
  };

  const handleConfirmAttendance = async () => {
    if (!selectedUser) return;
    await markAttendance(Number(selectedUser.id), selectedDate);
    fetchAttendanceByDate(selectedDate);
    setSuccessMessage(`${selectedUser.first_name} ${selectedUser.last_name} is marked present for the visit on ${selectedDate}`);
    setSelectedUser(null);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Mark Attendance for {selectedDate}</h2>
          <button onClick={onClose} className="text-red-500">
            <Icon path={mdiCloseCircle} size={1} />
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
            <p>{successMessage}</p>
          </div>
        )}

        <div className="flex items-center gap-4 mb-4">
          <label className="font-medium">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search user..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <Icon path={mdiMagnify} size={1} className="ml-2 text-gray-500" />
        </div>
        <div className="max-h-96 overflow-y-auto mb-4">
          {searchName.trim() && filteredUsers.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul>
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectUser(user)}
                >
                  <div>{user.first_name} {user.last_name}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mark Present Section */}
        {selectedUser && (
          <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg">
            <span className="font-semibold">Selected User: {selectedUser.first_name} {selectedUser.last_name}</span>
            <button
              onClick={handleConfirmAttendance}
              className="text-green-500 hover:text-green-700 flex items-center gap-2 py-2 px-4 rounded-lg bg-green-100 hover:bg-green-200"
            >
              <Icon path={mdiCheckCircle} size={1} /> Mark Present
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendanceModal;
