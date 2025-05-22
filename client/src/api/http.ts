import axios from "axios";

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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {

    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    const formattedError = new Error(
      error.response?.data?.message || error.message || 'An unknown error occurred'
    );
    formattedError.name = `HTTP_${error.response?.status || 500}`;
    
    throw formattedError;
  }
)

export default apiClient;