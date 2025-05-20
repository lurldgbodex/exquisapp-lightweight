import apiClient from "../../api/http";

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
    login: (data: LoginData) => apiClient.post('/auths/login', data),
    register: (data: RegisterData) => apiClient.post('/auths/register', data),
};