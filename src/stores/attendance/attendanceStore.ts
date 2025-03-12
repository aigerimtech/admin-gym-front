import { create } from "zustand";
import { apiClient, setAuthHeader } from "../api/apiCLient";
import { getToken } from "../utils/token";
import { format } from "date-fns";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface AttendanceRecord {
  id: number;
  user: User;
  visit_date: string;
  marked_by: { id: number };
}

interface AttendanceStore {
  attendance: AttendanceRecord[];
  totalVisitors: number;
  fetchAttendanceByDate: (date: string | Date) => Promise<void>;
  markAttendance: (userId: number, visitDate: string | Date) => Promise<void>;
  updateAttendance: (attendanceId: number, visitDate: string | Date) => Promise<void>;
  deleteAttendance: (attendanceId: number) => Promise<void>;
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  attendance: [],
  totalVisitors: 0,

  fetchAttendanceByDate: async (date) => {
    try {
      const token = getToken();
      if (token) setAuthHeader(token);

      const formattedDate = format(new Date(date), "yyyy-MM-dd");
      const response = await apiClient.post("/attendance/by-date", { date: formattedDate });

      set({ attendance: response.data, totalVisitors: response.data.length });
    } catch (error: any) {
      console.error("Error fetching attendance:", error.response?.data || error.message);
    }
  },

  markAttendance: async (userId, visitDate) => {
    try {
      const token = getToken();
      if (token) setAuthHeader(token);

      const formattedDate = format(new Date(visitDate), "yyyy-MM-dd'T00:00:00.000Z'");
      await apiClient.post("/attendance", { user: { id: userId }, visit_date: formattedDate });

      await get().fetchAttendanceByDate(visitDate);
    } catch (error: any) {
      console.error("Error marking attendance:", error.response?.data || error.message);
    }
  },

  updateAttendance: async (attendanceId, visitDate) => {
    try {
      const token = getToken();
      if (token) setAuthHeader(token);

      const formattedDate = format(new Date(visitDate), "yyyy-MM-dd'T00:00:00.000Z'");
      await apiClient.put(`/attendance/${attendanceId}`, { visit_date: formattedDate });

      await get().fetchAttendanceByDate(visitDate);
    } catch (error: any) {
      console.error("Error updating attendance:", error.response?.data || error.message);
    }
  },

  deleteAttendance: async (attendanceId) => {
    try {
      const token = getToken();
      if (token) setAuthHeader(token);

      await apiClient.delete(`/attendance/${attendanceId}`);

      await get().fetchAttendanceByDate(format(new Date(), "yyyy-MM-dd"));
    } catch (error: any) {
      console.error("Error deleting attendance:", error.response?.data || error.message);
    }
  },
}));
