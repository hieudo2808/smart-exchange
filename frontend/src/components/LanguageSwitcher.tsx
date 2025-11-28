import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSwitcher: React.FC = () => {
    const { t } = useTranslation();
    const { lang, setLang } = useLanguage();

    return (
        <div className="lang-switch">
            <button
                type="button"
                className={`lang-btn ${lang === "vi" ? "active" : ""}`}
                onClick={() => setLang("vi")}
                aria-label={t("lang.ariaVi")}
            >
                VI
            </button>
            <button
                type="button"
                className={`lang-btn ${lang === "jp" ? "active" : ""}`}
                onClick={() => setLang("jp")}
                aria-label={t("lang.ariaJp")}
            >
                JP
            </button>
        </div>
    );
};

export default LanguageSwitcher;
