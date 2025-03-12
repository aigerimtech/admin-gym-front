import { useState, useEffect } from "react";
import { mdiMagnify, mdiCheckCircle, mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import CardBox from "../components/CardBox";
import SectionMain from "../components/Section/Main";
import SectionTitle from "../components/Section/Title";
import { useAttendanceStore } from "../stores/attendance/attendanceStore";
import { format } from "date-fns";

const AttendancePage = () => {
  const { attendance, fetchAttendanceByDate, markAttendance, deleteAttendance } = useAttendanceStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [totalVisitors, setTotalVisitors] = useState(0);

  useEffect(() => {
    fetchAttendanceByDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    setTotalVisitors(attendance.length);
  }, [attendance]);

  return (
    <SectionMain className="mt-2"> 
      <SectionTitle>Attendance Management</SectionTitle>
      <CardBox>
        <div className="flex items-center gap-4 mb-6">
          <label className="font-medium">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 rounded w-full bg-gray-100 shadow-sm"
          />
        </div>
      </CardBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        <CardBox>
          <h2 className="text-lg font-semibold mb-4">Attendance List</h2>
          <table className="w-full border-collapse table-auto bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-3 text-left text-sm text-gray-600">ID</th>
                <th className="border p-3 text-left text-sm text-gray-600">Name</th>
                <th className="border p-3 text-left text-sm text-gray-600">Phone</th>
                <th className="border p-3 text-left text-sm text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length > 0 ? (
                attendance.map((record, index) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-all">
                    <td className="border p-3 text-center">{record.id}</td> {/* Displaying actual ID */}
                    <td className="border p-3">{record.user.first_name} {record.user.last_name}</td>
                    <td className="border p-3">{record.user.phone}</td>
                    <td className="border p-3 flex gap-3 items-center justify-start">
                      <button className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm font-medium">
                        <Icon path={mdiCheckCircle} size={0.8} /> Present
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm font-medium"
                        onClick={() => deleteAttendance(record.id)}
                      >
                        <Icon path={mdiTrashCan} size={0.8} /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No attendance records for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBox>

        <CardBox>
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg text-center">
            <p className="text-xl font-semibold">Total Visitors: {totalVisitors}</p>
            <p className="text-gray-600 mt-2">Keep track of daily attendance and manage records easily.</p>
          </div>
        </CardBox>
      </div>
    </SectionMain>
  );
};

export default AttendancePage;
