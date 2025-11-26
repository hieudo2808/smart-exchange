import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthLayout from "../layouts/AuthLayout";
import TextInput from "../components/TextInput";
import PrimaryButton from "../components/PrimaryButton";
import type { Lang } from "../App";
import googleLogo from "../assets/google-logo.png";
interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LoginPage: React.FC<Props> = ({ lang, setLang }) => {
  const { t } = useTranslation(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(t("auth.login.errorMissing"));
      return;
    }

    try {
      setLoading(true);
      // TODO: gọi API login thật
      console.log("Login with:", { email, password });
    } catch (err) {
      const error = err as Error;
      setError(error?.message || t("auth.login.errorLoginFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: sửa URL theo backend 
    window.location.href = "/api/auth/google";
  };

  return (
    <AuthLayout
      title={t("auth.login.title")}
      lang={lang}
      onChangeLang={setLang}
    >
      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <TextInput
          label={t("auth.login.emailLabel")}
          type="email"
          placeholder={t("auth.login.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextInput
          label={t("auth.login.passwordLabel")}
          type="password"
          placeholder={t("auth.login.passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PrimaryButton type="submit" disabled={loading}>
          {loading
            ? t("auth.login.loginProcessing")
            : t("auth.login.submit")}
        </PrimaryButton>
      </form>

      <button className="google-btn" onClick={handleGoogleLogin}>
        <img
          src={googleLogo}
          alt={t("auth.googleAlt")}
          className="google-icon"
        />
        <span>{t("auth.login.google")}</span>
      </button>

      <div className="auth-bottom-text">
        {t("auth.login.noAccount")}{" "}
        <Link to="/register" className="link">
          {t("auth.login.register")}
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;