import { useState, useEffect } from "react";
import { mdiPencil, mdiDelete } from '@mdi/js';
import Icon from '@mdi/react';
import Button from "../components/Button";
import CardBox from "../components/CardBox";
import SectionMain from "../components/Section/Main";
import SectionTitle from "../components/Section/Title";
import { useAttendanceStore } from "../stores/attendance/attendanceStore";
import { apiClient, setAuthHeader } from "../stores/api/apiCLient";
import { getToken } from "../stores/utils/token";
import { format } from "date-fns";
import CardBoxModal from "../components/CardBox/Modal";

const AttendancePage = () => {
  const { attendance, fetchAttendanceByDate, markAttendance, updateAttendance, deleteAttendance } = useAttendanceStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchName, setSearchName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    setAuthHeader(getToken());
    fetchAttendanceByDate(selectedDate);
  }, [selectedDate]);

  const handleSearch = async () => {
    try {
      const response = await apiClient.get(`/users/search/${searchName}`);
      if (response.data.length) {
        setSelectedUser(response.data[0]);
      }
    } catch (error) {
      console.error("Error searching user:", error);
    }
  };

  const handleMarkAttendance = async () => {
    if (!selectedUser) return;
    await markAttendance(selectedUser.id, selectedDate);
    fetchAttendanceByDate(selectedDate);
  };

  return (
    <SectionMain>
      <SectionTitle>Attendance Management</SectionTitle>
      <CardBox>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Select Date</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full border p-2 rounded shadow-sm" />
          </div>
          <div>
            <label className="block font-semibold">Search User</label>
            <div className="flex gap-2">
              <input type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="w-full border p-2 rounded shadow-sm" />
              <Button onClick={handleSearch} label="Search" />
            </div>
          </div>
        </div>
        {selectedUser && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-300 rounded">
            <p className="font-semibold">Selected User: {selectedUser.first_name} {selectedUser.last_name}</p>
            <Button onClick={handleMarkAttendance} label="Mark Present" className="mt-2" />
          </div>
        )}
      </CardBox>
      <CardBox>
        <table className="w-full border-collapse border border-gray-300 shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Attendance</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record, index) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{record.user.first_name} {record.user.last_name}</td>
                <td className="border p-2">{record.user.phone}</td>
                <td className="border p-2 text-green-600 font-semibold">Present</td>
                <td className="border p-2 flex gap-2 justify-center">
                  <button onClick={() => { setSelectedRecord(record); setIsUpdateModalOpen(true); }} className="text-blue-500 hover:text-blue-700">
                    <Icon path={mdiPencil} size={1} />
                  </button>
                  <button onClick={() => { setSelectedRecord(record); setIsDeleteModalOpen(true); }} className="text-red-500 hover:text-red-700">
                    <Icon path={mdiDelete} size={1} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBox>
      {isUpdateModalOpen && (
        <CardBoxModal
          title="Update Attendance"
          buttonColor="info"
          buttonLabel="Confirm"
          isActive={isUpdateModalOpen}
          onConfirm={() => {
            if (!selectedRecord || !newDate) return;
            updateAttendance(selectedRecord.id, newDate);
            setIsUpdateModalOpen(false);
            fetchAttendanceByDate(selectedDate);
          }}
          onCancel={() => setIsUpdateModalOpen(false)}
        >
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full border p-2 rounded shadow-sm" />
        </CardBoxModal>
      )}
      {isDeleteModalOpen && (
        <CardBoxModal
          title="Delete Attendance"
          buttonColor="danger"
          buttonLabel="Confirm"
          isActive={isDeleteModalOpen}
          onConfirm={() => {
            if (!selectedRecord) return;
            deleteAttendance(selectedRecord.id);
            setIsDeleteModalOpen(false);
            fetchAttendanceByDate(selectedDate);
          }}
          onCancel={() => setIsDeleteModalOpen(false)}
        >
          <p>Are you sure you want to delete this record?</p>
        </CardBoxModal>
      )}
    </SectionMain>
  );
};

export default AttendancePage;
