import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authService, userService } from "../services/api";

interface User {
    id: string;
    email: string;
    jobTitle: string | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifySession = async () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                setLoading(false);
                return;
            }

            try {
                const currentUser = await userService.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error("AuthContext - verification failed:", error);
                localStorage.removeItem("user");
                localStorage.removeItem("settings");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, []);

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.warn("Backend logout failed, continuing with client-side logout:", error);
        }

        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("settings");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
