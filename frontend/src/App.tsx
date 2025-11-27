import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import i18n from "./i18n";

export type Lang = "vi" | "jp";

function App() {
    const [lang, setLang] = useState<Lang>("jp"); // mặc định JP

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route
                    path="/login"
                    element={<LoginPage lang={lang} setLang={setLang} />}
                />
                <Route
                    path="/register"
                    element={<RegisterPage lang={lang} setLang={setLang} />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
