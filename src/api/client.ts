import { notification } from "antd";
import axios from "axios";
import { useAuthStore } from "../store/auth";

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

client.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().jwtToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  (response) => {
    if (response.config.method !== "get" && response.data?.message) {
      notification.success({
        message: "Éxito",
        description: response.data.message,
        placement: "topRight",
      });
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      useAuthStore.setState({
        jwtToken: null,
      });
      notification.error({
        message: "Error de Autenticación",
        description: "Sesión expirada. Por favor, inicie sesión nuevamente.",
        placement: "topRight",
      });
    }

    return Promise.reject(error);
  },
);
