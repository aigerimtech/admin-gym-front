import { apiClient, setAuthHeader } from "../api/apiCLient";
import { AuthState } from "./authStore";

type SetState = (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void;
type GetState = () => AuthState;

// ✅ Получение информации о текущем пользователе
export const fetchCurrentUser = async (set: SetState) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found");
    return null;
  }

  try {
    const response = await apiClient.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Fetched User Profile:", response.data);

    set((state) => ({
      currentUser: response.data,
      users: [...state.users, response.data],
    }));

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
};

export const registerAll = async (
  set: SetState,
  userData: { first_name: string; last_name: string; email: string; phone: string; password: string }
): Promise<string> => {
  try {
    const response = await apiClient.post("/auth/register/all", userData);

    if (response.status === 201) {
      await fetchCurrentUser(set);
      return "Registration successful!";
    }
    return "Registration failed!";
  } catch (error: any) {
    console.error("Registration error:", error?.response?.data);
    if (error.response?.status === 409) {
      return "User already registered!";
    }
    return error?.response?.data?.message || "Error registering user!";
  }
};

export const register = async (
  set: SetState,
  userData: { first_name: string; last_name: string; email: string; phone: string; password: string; access_level: string }
): Promise<string> => {
  const token = localStorage.getItem("token");
  if (!token) return "Unauthorized: Please log in first.";

  try {
    const response = await apiClient.post("/auth/register", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      set((state) => ({ users: [...state.users, response.data] }));
      return "Admin registration successful!";
    }
    return "Admin registration failed!";
  } catch (error: any) {
    console.error("Admin Registration error:", error?.response?.data);
    return error?.response?.data?.message || "Error registering admin!";
  }
};

// ✅ Вход в систему
export const loginUser = async (
  set: SetState,
  get: GetState,
  credentials: { email: string; password: string }
): Promise<string> => {
  try {
    const response = await apiClient.post("/auth/login", credentials);

    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      setAuthHeader(response.data.access_token);

      // Получаем профиль пользователя
      await fetchCurrentUser(set);

      set({
        isAuthenticated: true,
        token: response.data.access_token,
      });

      return "Logged in successfully!";
    } else {
      return "Invalid credentials!";
    }
  } catch (error: any) {
    console.error("Login error:", error?.response?.data);
    return error?.response?.data?.message || "Login failed!";
  }
};

// ✅ Выход из системы
export const logoutUser = (set: SetState) => {
  localStorage.removeItem("token");
  setAuthHeader(null);
  set({
    currentUser: null,
    isAuthenticated: false,
    token: null,
  });
};

// ✅ Получение всех пользователей
export const fetchUsers = async (set: SetState, get: GetState) => {
  try {
    const { token } = get();
    if (!token) return;

    const response = await apiClient.get("/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    set({ users: response.data });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
