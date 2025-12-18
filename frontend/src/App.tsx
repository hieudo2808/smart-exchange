import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Imports Components & Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import TutorialPage from "./pages/TutorialPage/TutorialPage";

// Imports Settings Pages
import SettingsPage from "./pages/SettingsPage";
import SettingsOverview from "./pages/settings/SettingsOverview";
import LanguageSettings from "./pages/settings/LanguageSettings";
import ThemeSettings from "./pages/settings/ThemeSettings";
import NotificationsSettings from "./pages/settings/NotificationsSettings";
import SecuritySettings from "./pages/settings/SecuritySettings";
import SystemSettings from "./pages/settings/SystemSettings";
import HelpSettings from "./pages/settings/HelpSettings";
import LogoutSettings from "./pages/settings/LogoutSettings";

// Imports Contexts & Layouts
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SocketProvider } from "./contexts/SocketContext";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { PublicRoute } from "./components/PublicRoute";
import { ThemeProvider } from "./contexts/ThemeContext";

// --- 1. Guard cho trang Home ---
// Nếu chưa xong Tutorial -> Đá sang /tutorial
const HomeGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (user && !user.isTutorialCompleted) {
        return <Navigate to="/tutorial" replace />;
    }

    return <>{children}</>;
};

// --- 2. Guard cho trang Tutorial ---
// Nếu đã xong Tutorial -> Đá về Home (/)
const TutorialGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (user && user.isTutorialCompleted) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

function App() {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <BrowserRouter>
                <AuthProvider>
                    <ThemeProvider>
                    <LanguageProvider>
                        <SocketProvider>
                            <Routes>
                                {/* --- Public Routes (Login/Register) --- */}
                                <Route element={<PublicRoute />}>
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />
                                </Route>

                                {/* --- Protected Routes --- */}
                                <Route element={<ProtectedLayout />}>
                                    
                                    {/* 1. Home Page (Có Guard chặn nếu chưa học Tutorial) */}
                                    <Route path="/" element={
                                        <HomeGuard>
                                            <HomePage />
                                        </HomeGuard>
                                    } />

                                    {/* 2. Tutorial Page (Có Guard chặn nếu đã học xong) */}
                                    <Route path="/tutorial" element={
                                        <TutorialGuard>
                                            <TutorialPage />
                                        </TutorialGuard>
                                    } />

                                    {/* 3. Các trang chức năng khác */}
                                    <Route path="/profile" element={<ProfilePage />} />
                                    <Route path="/chat" element={<ChatPage />} />

                                    {/* 4. Settings (Nested Routes) */}
                                    <Route path="/settings" element={<SettingsPage />}>
                                        <Route index element={<SettingsOverview />} />
                                        <Route path="language" element={<LanguageSettings />} />
                                        <Route path="theme" element={<ThemeSettings />} />
                                        <Route path="notifications" element={<NotificationsSettings />} />
                                        <Route path="security" element={<SecuritySettings />} />
                                        <Route path="system" element={<SystemSettings />} />
                                        <Route path="help" element={<HelpSettings />} />
                                        <Route path="logout" element={<LogoutSettings />} />
                                    </Route>

                                    {/* Catch-all route - redirect to home if route not found */}
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Route>
                            </Routes>
                        </SocketProvider>
                    </LanguageProvider>
                    </ThemeProvider>
                </AuthProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}

export default App;