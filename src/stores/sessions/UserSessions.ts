import { create } from "zustand";
import { apiClient } from "../api/apiCLient";
import { getToken } from "../utils/token";

interface SessionRegistration {
  id: number;
  user: number;
  sessionDate: Date;
}

interface UserSessionState {
  registrations: SessionRegistration[];
  fetchRegistrations: () => Promise<void>;
  registerForSession: (data: { userId: number; sessionDate: Date }) => Promise<void>;
  cancelRegistration: (registrationId: number) => Promise<void>;
  sessions: { id: number; title: string; date: string }[];
  fetchSessions: () => Promise<void>;
}

export const useUserSessionStore = create<UserSessionState>((set, get) => ({
  registrations: [],
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

  fetchRegistrations: async () => {
    const token = getToken();
    if (!token) return console.warn("No token found, cannot fetch registrations.");
    try {
      const response = await apiClient.get("/session-registrations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ registrations: response.data });
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  },

  registerForSession: async ({ userId, sessionDate }: { userId: number; sessionDate: Date }) => {
    const token = getToken();
    if (!token) return console.warn("No token found, cannot register.");
    try {
      const response = await apiClient.post(
        "/session-registrations",
        { user: userId, sessionDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        registrations: [...state.registrations, response.data],
      }));
    } catch (error) {
      console.error("Error registering for session:", error);
    }
  },

  cancelRegistration: async (registrationId) => {
    const token = getToken();
    if (!token) return console.warn("No token found, cannot cancel registration.");
    try {
      await apiClient.delete(`/session-registrations/${registrationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        registrations: state.registrations.filter((r) => r.id !== registrationId),
      }));
    } catch (error) {
      console.error("Error canceling registration:", error);
    }
  },
}));
