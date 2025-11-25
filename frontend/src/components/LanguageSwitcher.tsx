import React from "react";
import type { Lang } from "../App";

interface Props {
  lang: Lang;
  onChangeLang: (lang: Lang) => void;
}

const LanguageSwitcher: React.FC<Props> = ({ lang, onChangeLang }) => {
  return (
    <div className="lang-switch">
      <button
        type="button"
        className={`lang-btn ${lang === "vi" ? "active" : ""}`}
        onClick={() => onChangeLang("vi")}
      >
        VI
      </button>
      <button
        type="button"
        className={`lang-btn ${lang === "jp" ? "active" : ""}`}
        onClick={() => onChangeLang("jp")}
      >
        JP
      </button>
    </div>
  );
};

export default LanguageSwitcher;
