import type { AxiosError } from "axios";
import apiClient from "../../api/http";
import { ApiError } from "../../utils/errors";

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export const authApi = {
    login: async (data: LoginData) => {
        try {
            const response = await apiClient.post('/auths/login', data)
            return response.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errMessage = err.response?.data?.message ?? 'invalid credentials'
            throw new ApiError(errMessage, err.response?.status ?? 500)
        }
    },
    register: async (data: RegisterData) => {
        try {
            const response = await  apiClient.post('/auths/register', data);
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            throw new ApiError(err.message, err.response?.status ?? 500);
        }
    },
    getMe: async () => {
        try {
            const response = await apiClient.get('/users/me');
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            throw new ApiError(err.message, err.response?.status ?? 500);
        }
    }
};