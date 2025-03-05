import { apiClient, setAuthHeader } from "../api/apiCLient";
import { AuthState } from "./authStore";
import { useAdminStore } from "../admin/adminStore";

type SetState = (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void;
type GetState = () => AuthState;

// Получение текущего пользователя
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

    set({
      currentUser: response.data,
      isAuthenticated: true,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
};

// Регистрация пользователя (публичная)
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

// Регистрация администратора (только с токеном)
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
      useAdminStore.getState().fetchUsers();
      return "Admin registration successful!";
    }
    return "Admin registration failed!";
  } catch (error: any) {
    console.error("Admin Registration error:", error?.response?.data);
    return error?.response?.data?.message || "Error registering admin!";
  }
};

// Вход пользователя
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
      const user = await fetchCurrentUser(set);

      set({
        isAuthenticated: true,
        token: response.data.access_token,
      });

      if (user?.role === "ADMIN") {
        return "Admin Logged in successfully!";
      }

      return "Logged in successfully!";
    } else {
      return "Invalid credentials!";
    }
  } catch (error: any) {
    console.error("Login error:", error?.response?.data);
    return error?.response?.data?.message || "Login failed!";
  }
};

// Выход из системы
export const logoutUser = (set: SetState) => {
  localStorage.removeItem("token");
  setAuthHeader(null);
  set({
    currentUser: null,
    isAuthenticated: false,
    token: null,
  });
};