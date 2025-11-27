import React from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import type { Lang } from "../App";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string; // tiêu đề theo lang
    lang: Lang;
    onChangeLang: (lang: Lang) => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    lang,
    onChangeLang,
}) => {
    return (
        <div className="auth-page">
            <header className="auth-header">
                <div className="app-name">Smart Exchange</div>
                <LanguageSwitcher lang={lang} onChangeLang={onChangeLang} />
            </header>

            <main className="auth-main">
                <div className="auth-card">
                    <h1 className="auth-title">{title}</h1>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AuthLayout;
