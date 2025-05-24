import axios from "axios";
import type { NavigateFunction } from "react-router-dom";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', 
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const setupInterceptors = (navigate: NavigateFunction ) => {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status == 401) {
        localStorage.removeItem('accessToken');
        navigate('/login');
        return Promise.reject(error);
      }

      const formattedError = new Error(
        error.response?.data?.message || error.message || "An unknown error occurred"
      );
      formattedError.name = `HTTP_${error.response?.status || 500}`;
    
      throw formattedError;
    }
  )
}

export default apiClient;