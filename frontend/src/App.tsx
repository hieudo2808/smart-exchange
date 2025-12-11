import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { PublicRoute } from "./components/PublicRoute";

function App() {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <BrowserRouter>
                <AuthProvider>
                    <LanguageProvider>
                        <Routes>
                            {/* Public Routes */}
                            <Route element={<PublicRoute />}>
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                            </Route>

                            {/* Protected Routes */}
                            <Route element={<ProtectedLayout />}>
                                <Route path="/" element={<HomePage />} />
                            </Route>
                        </Routes>
                    </LanguageProvider>
                </AuthProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}

export default App;
