import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "../features/auth/api";

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryCient = useQueryClient();
    const [user, setUser] = useState<any | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>{
        return !!localStorage.getItem('accessToken');
    })

    const login = (token: string, userData?: any) => {
        localStorage.setItem('accessToken', token);
        setIsAuthenticated(true);
        if (userData) setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        setUser(null);
        queryCient.clear();
    };

    useEffect(() => {
        if (isAuthenticated && !user) {
            authApi.getMe()
                .then(response => setUser(response.data))
                .catch(() => logout());
        }
    })

    const value = { isAuthenticated, user, login, logout };

    return <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext);
}