import { create } from "zustand";
import { apiClient } from "../api/apiCLient";
import { getToken } from "../utils/token";
import {User} from "../auth/authStore";

interface Session {
  id: number
  name:  string,
  trainer: User,
  start_time: string,
  end_time: string,
  capacity: number,
  available_slots: number,
  registrations?: null | User[]
}

interface CreateSession {
  name: string,
  trainer: number,
  start_time: string,
  end_time: string,
  capacity: number,
  available_slots: number,
}

interface AdminSessionState {
  sessions: Session[];
  fetchSessions: () => Promise<void>;
  createSession: (sessionData: CreateSession) => Promise<void>;
  updateSession: (id: number, sessionData: Partial<CreateSession>) => Promise<void>;
  deleteSession: (id: number) => Promise<void>;
}

export const useAdminSessionStore = create<AdminSessionState>((set, get) => ({
  sessions: [],

  fetchSessions: async () => {
    const token = getToken();
    if (!token) return console.warn("No token found, cannot fetch sessions.");

    try {
      const response = await apiClient.get("/sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ sessions: response.data });
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  },

  createSession: async (sessionData) => {
    const token = getToken();
    if (!token) return console.warn("No token found, cannot create session.");

    try {
      const response = await apiClient.post("/sessions", sessionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const {fetchSessions} = get()
      fetchSessions()
    } catch (error) {
      console.error("Error creating session:", error);
    }
  },

  updateSession: async (id, sessionData) => {
    const token = getToken();
    if (!token) return console.warn("No token found, cannot update session.");

    try {
      const response = await apiClient.put(`/sessions/${id}`, sessionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error updating session:", error);
    }
  },

  deleteSession: async (id) => {
    const token = getToken();
    if (!token) return console.warn("No token found, cannot delete session.");

    try {
      await apiClient.delete(`/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  },
}));
