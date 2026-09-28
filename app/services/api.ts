import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
console.log(API_URL);


export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    // Garante que o código roda no lado do cliente antes de acessar o localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("@autoChime:AccessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
        if (typeof window === "undefined") {
          throw new Error("Execução fora do contexto do navegador");
        }

        const refreshToken = localStorage.getItem("@autoChime:RefreshToken");

        if (!refreshToken) {
          throw new Error("Sem refresh token disponível");
        }

        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem("@autoChime:AccessToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("@autoChime:RefreshToken", data.refreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("@autoChime:AccessToken");
          localStorage.removeItem("@autoChime:RefreshToken");
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);