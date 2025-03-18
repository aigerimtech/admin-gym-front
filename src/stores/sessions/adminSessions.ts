import { create } from "zustand";
import { apiClient } from "../api/apiCLient";
import { getToken } from "../utils/token";

interface Session {
  id: number;
  title: string;
  date: string;
}

interface AdminSessionState {
  sessions: Session[];
  fetchSessions: () => Promise<void>;
  createSession: (sessionData: { title: string; date: string }) => Promise<void>;
  updateSession: (id: number, sessionData: Partial<Session>) => Promise<void>;
  deleteSession: (id: number) => Promise<void>;
}

export const useAdminSessionStore = create<AdminSessionState>((set) => ({
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
      set((state) => ({ sessions: [...state.sessions, response.data] }));
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
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...response.data } : s)),
      }));
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
