import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SettingsOverview from "./pages/settings/SettingsOverview";
import LanguageSettings from "./pages/settings/LanguageSettings";
import ThemeSettings from "./pages/settings/ThemeSettings";
import NotificationsSettings from "./pages/settings/NotificationsSettings";
import SecuritySettings from "./pages/settings/SecuritySettings";
import SystemSettings from "./pages/settings/SystemSettings";
import HelpSettings from "./pages/settings/HelpSettings";
import LogoutSettings from "./pages/settings/LogoutSettings";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { PublicRoute } from "./components/PublicRoute";
import ChatPage from "./pages/ChatPage";

function App() {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        {/* Public Routes */}
                        <Route element={<PublicRoute />}>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                        </Route>

                        {/* Protected Routes */}
                        <Route element={<ProtectedLayout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/chat" element={<ChatPage />} />
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
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}

export default App;
