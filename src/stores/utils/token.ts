export const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);

export const setToken = (token: string | null) => {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }
};
