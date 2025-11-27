import React from "react";
import { useTranslation } from "react-i18next";
import type { Lang } from "../App";

interface Props {
    lang: Lang;
    onChangeLang: (lang: Lang) => void;
}

const LanguageSwitcher: React.FC<Props> = ({ lang, onChangeLang }) => {
    const { t } = useTranslation();
    return (
        <div className="lang-switch">
            <button
                type="button"
                className={`lang-btn ${lang === "vi" ? "active" : ""}`}
                onClick={() => onChangeLang("vi")}
                aria-label={t("lang.ariaVi")}
            >
                VI
            </button>
            <button
                type="button"
                className={`lang-btn ${lang === "jp" ? "active" : ""}`}
                onClick={() => onChangeLang("jp")}
                aria-label={t("lang.ariaJp")}
            >
                JP
            </button>
        </div>
    );
};

export default LanguageSwitcher;
