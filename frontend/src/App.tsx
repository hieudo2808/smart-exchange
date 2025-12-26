import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

<<<<<<< HEAD
// Imports Components & Pages
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
=======
/* ===== Pages ===== */
import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
>>>>>>> 6ddeca12ca6ff86c3a713aad49487b5def2dfa63
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import TutorialPage from "./pages/TutorialPage/TutorialPage";

/* ===== Settings ===== */
import SettingsPage from "./pages/SettingsPage";
import SettingsOverview from "./pages/settings/SettingsOverview";
import LanguageSettings from "./pages/settings/LanguageSettings";
import ThemeSettings from "./pages/settings/ThemeSettings";
import NotificationsSettings from "./pages/settings/NotificationsSettings";
import SecuritySettings from "./pages/settings/SecuritySettings";
import SystemSettings from "./pages/settings/SystemSettings";
import HelpSettings from "./pages/settings/HelpSettings";
import LogoutSettings from "./pages/settings/LogoutSettings";

/* ===== Contexts & Layouts ===== */
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";

import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { PublicRoute } from "./components/PublicRoute";

/* ===== Guards ===== */

// Nếu user CHƯA hoàn thành tutorial → đá sang /tutorial
const HomeGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

<<<<<<< HEAD
    if (loading)
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
=======
    if (loading) {
        return (
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Loading...
            </div>
        );
    }
>>>>>>> 6ddeca12ca6ff86c3a713aad49487b5def2dfa63

    if (user && !user.isTutorialCompleted) {
        return <Navigate to="/tutorial" replace />;
    }

    return <>{children}</>;
};

// Nếu user ĐÃ hoàn thành tutorial → không cho vào /tutorial nữa
const TutorialGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

<<<<<<< HEAD
    if (loading)
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
=======
    if (loading) {
        return (
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Loading...
            </div>
        );
    }
>>>>>>> 6ddeca12ca6ff86c3a713aad49487b5def2dfa63

    if (user && user.isTutorialCompleted) {
        return <Navigate to="/home" replace />;
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
<<<<<<< HEAD
                                    {/* --- Public Routes (Login/Register) --- */}
=======

                                    {/* ===== LANDING (ROOT – KHÔNG GUARD) ===== */}
                                    <Route path="/" element={<LandingPage />} />

                                    {/* ===== PUBLIC (LOGIN / REGISTER) ===== */}
>>>>>>> 6ddeca12ca6ff86c3a713aad49487b5def2dfa63
                                    <Route element={<PublicRoute />}>
                                        <Route path="/login" element={<LoginPage />} />
                                        <Route path="/register" element={<RegisterPage />} />
                                    </Route>

<<<<<<< HEAD
                                    {/* --- Protected Routes --- */}
                                    <Route element={<ProtectedLayout />}>
                                        {/* 1. Home Page (Có Guard chặn nếu chưa học Tutorial) */}
                                        <Route
                                            path="/"
=======
                                    {/* ===== PROTECTED ===== */}
                                    <Route element={<ProtectedLayout />}>
                                        <Route
                                            path="/home"
>>>>>>> 6ddeca12ca6ff86c3a713aad49487b5def2dfa63
                                            element={
                                                <HomeGuard>
                                                    <HomePage />
                                                </HomeGuard>
                                            }
                                        />

<<<<<<< HEAD
                                        {/* 2. Tutorial Page (Có Guard chặn nếu đã học xong) */}
=======
>>>>>>> 6ddeca12ca6ff86c3a713aad49487b5def2dfa63
                                        <Route
                                            path="/tutorial"
                                            element={
                                                <TutorialGuard>
                                                    <TutorialPage />
                                                </TutorialGuard>
                                            }
                                        />

<<<<<<< HEAD
                                        {/* 3. Các trang chức năng khác */}
                                        <Route path="/profile" element={<ProfilePage />} />
                                        <Route path="/chat" element={<ChatPage />} />

                                        {/* 4. Settings (Nested Routes) */}
=======
                                        <Route path="/chat" element={<ChatPage />} />
                                        <Route path="/profile" element={<ProfilePage />} />

>>>>>>> 6ddeca12ca6ff86c3a713aad49487b5def2dfa63
                                        <Route path="/settings" element={<SettingsPage />}>
                                            <Route index element={<SettingsOverview />} />
                                            <Route path="language" element={<LanguageSettings />} />
                                            <Route path="theme" element={<ThemeSettings />} />
<<<<<<< HEAD
                                            <Route
                                                path="notifications"
                                                element={<NotificationsSettings />}
                                            />
=======
                                            <Route path="notifications" element={<NotificationsSettings />} />
>>>>>>> 6ddeca12ca6ff86c3a713aad49487b5def2dfa63
                                            <Route path="security" element={<SecuritySettings />} />
                                            <Route path="system" element={<SystemSettings />} />
                                            <Route path="help" element={<HelpSettings />} />
                                            <Route path="logout" element={<LogoutSettings />} />
                                        </Route>
<<<<<<< HEAD

                                        {/* Catch-all route - redirect to home if route not found */}
                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Route>
=======
                                    </Route>

                                    {/* ===== FALLBACK ===== */}
                                    <Route path="*" element={<Navigate to="/" replace />} />

>>>>>>> 6ddeca12ca6ff86c3a713aad49487b5def2dfa63
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
