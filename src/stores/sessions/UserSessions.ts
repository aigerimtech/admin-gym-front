import { create } from "zustand";
import { apiClient } from "../api/apiCLient";
import { getToken } from "../utils/token";

interface SessionRegistration {
  sessionId: number;
  user: number;
  sessionDate: Date;
}

interface UserSessionState {
  postRegistration: (registration: SessionRegistration) => void;
  getRegistrations: () => Promise<void>;
}

export const useUserSessionStore = create<UserSessionState>((set, get) => ({
  postRegistration: async (registration) => {
    try {
      const token = getToken();
      await apiClient.post("/session-registrations", {
        userId:registration.user,
        sessionId: registration.sessionId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
  getRegistrations: async () => {
    try {
      const token = getToken();
      const response = await apiClient.get("/session-registrations/upcomingSessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
}));
