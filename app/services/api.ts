import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@autoChime:AccessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("@autoChime:RefreshToken");

        if (!refreshToken) {
          throw new Error("Sem refresh token disponível");
        }

        const { data } = await axios.post(
          "http://localhost:3001/auth/refresh",
          {
            refreshToken,
          },
        );

        localStorage.setItem("@autoChime:AccessToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("@autoChime:RefreshToken", data.refreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("@autoChime:AccessToken");
        localStorage.removeItem("@autoChime:RefreshToken");

        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
