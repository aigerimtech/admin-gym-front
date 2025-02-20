import { apiClient, setAuthHeader } from "../api/apiCLient";
import { AuthState } from "./authStore";

type SetState = (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void;
type GetState = () => AuthState;

export const registerUser = async (
  set: SetState,
  userData: { first_name: string; last_name: string; email: string; phone: string; password: string }
): Promise<string> => {
  try {
    const response = await apiClient.post("/auth/register/all", {
      ...userData,
      access_level: "client",
    });

    if (response.data.id) {
      // Update store with new user
      set((state) => ({ users: [...state.users, response.data] }));
      return "Registration successful!";
    } else {
      return "Registration failed!";
    }
  } catch (error: any) {
    return error?.response?.data?.message || "Error registering user!";
  }
};

export const loginUser = async (
  set: SetState,
  get: GetState,
  credentials: { email: string; password: string }
): Promise<string> => {
  try {
    const response = await apiClient.post("/auth/login", credentials);

    if (response.data.access_token) {
      setAuthHeader(response.data.access_token);

      const userResponse = await apiClient.get("/users");

      set({
        currentUser: userResponse.data,
        isAuthenticated: true,
        token: response.data.access_token,
      });

      return "Logged in successfully!";
    } else {
      return "Invalid credentials!";
    }
  } catch (error: any) {
    return error?.response?.data?.message || "Login failed!";
  }
};

export const logoutUser = (set: SetState) => {
  setAuthHeader(null);
  set({
    currentUser: null,
    isAuthenticated: false,
    token: null,
  });
};

export const fetchUsers = async (set: SetState, get: GetState) => {
  try {
    const { token } = get();
    if (!token) return;

    const response = await apiClient.get("/users");
    set({ users: response.data });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
