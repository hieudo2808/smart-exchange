import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isJP = lang === "jp";

  const title = isJP ? "ログイン" : "Đăng nhập";
  const emailLabel = isJP ? "メールアドレス" : "Email";
  const emailPlaceholder = isJP
    ? "メールアドレスを入力してください"
    : "Nhập địa chỉ email";
  const passLabel = isJP ? "パスワード" : "Mật khẩu";
  const passPlaceholder = isJP
    ? "パスワードを入力してください"
    : "Nhập mật khẩu";
  const submitText = isJP ? "ログイン" : "Đăng nhập";
  const googleText = isJP
    ? "Googleでログイン"
    : "Đăng nhập bằng Google";
  const bottomText = isJP ? "アカウントをお持ちでない場合？" : "Chưa có tài khoản?";
  const bottomLinkText = isJP ? "新規登録" : "Đăng ký";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(isJP ? "メールとパスワードを入力してください。" : "Vui lòng nhập email và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      // TODO: gọi API login thật
      console.log("Login with:", { email, password });
    } catch (err: any) {
      setError(err.message || (isJP ? "ログインに失敗しました。" : "Đăng nhập thất bại."));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: sửa URL theo backend
    window.location.href = "/api/auth/google";
  };

  return (
    <AuthLayout title={title} lang={lang} onChangeLang={setLang}>
      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <TextInput
          label={emailLabel}
          type="email"
          placeholder={emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextInput
          label={passLabel}
          type="password"
          placeholder={passPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? (isJP ? "処理中..." : "Đang đăng nhập...") : submitText}
        </PrimaryButton>
      </form>

      <button className="google-btn" onClick={handleGoogleLogin}>
        <img src={googleLogo} alt="Google" className="google-icon" />
        <span>{googleText}</span>
      </button>


      <div className="auth-bottom-text">
        {bottomText}{" "}
        <Link to="/register" className="link">
          {bottomLinkText}
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
