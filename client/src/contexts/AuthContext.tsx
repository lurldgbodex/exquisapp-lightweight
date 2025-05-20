import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryCient = useQueryClient();

    const login = (token: string) => {
        localStorage.setItem('accessToken', token);
    };

    const logout = () => {
        localStorage.removeItem('accessToken')
        queryCient.clear();
    };

    const isAuthenticated = !localStorage.getItem('accessToken');

    const value = { isAuthenticated, login, logout };

    return <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext);
}