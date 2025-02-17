import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { useAppDispatch } from "../stores/hooks"; // Импортируем dispatch
import { setUser } from "../stores/mainSlice"; // Импортируем Redux-экшен

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthState {
  user: User | null;
  users: Record<string, User>; // Store users in an object for better management
  register: (newUser: Omit<User, "id">) => string;
  login: (credentials: { email: string; password: string }) => string;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        users: {}, // Store users with email as key

        register: (newUser) => {
          const { users } = get();
          if (users[newUser.email]) {
            return "Email is already registered!";
          }

          const id = Date.now();
          set((state) => ({
            users: { ...state.users, [newUser.email]: { ...newUser, id } },
          }));

          return "Registration successful!";
        },

        login: ({ email, password }) => {
          const { users } = get();
          const user = users[email];

          if (!user || user.password !== password) {
            return "Incorrect email or password!";
          }

          set({ user });

          // Обновляем Redux-хранилище
          const dispatch = useAppDispatch();
          dispatch(setUser({ name: user.name, email: user.email }));

          return "Logged in successfully!";
        },

        

        logout: () => set({ user: null }),
      }),
      { name: "auth-storage" }
    )
  )
);
