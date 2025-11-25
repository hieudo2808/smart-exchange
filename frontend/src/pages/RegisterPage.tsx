import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import TextInput from "../components/TextInput";
import PrimaryButton from "../components/PrimaryButton";
import type { Lang } from "../App";
import googleLogo from "../assets/google-logo.png";


interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const RegisterPage: React.FC<Props> = ({ lang, setLang }) => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isJP = lang === "jp";

  const title = isJP ? "登録" : "Đăng ký";
  const nameLabel = isJP ? "氏名" : "Họ và tên";
  const namePlaceholder = isJP ? "お名前を入力してください" : "Nhập họ và tên";
  const emailLabel = isJP ? "メールアドレス" : "Email";
  const emailPlaceholder = isJP
    ? "メールアドレスを入力してください"
    : "Nhập địa chỉ email";
  const passLabel = isJP ? "パスワード" : "Mật khẩu";
  const passPlaceholder = isJP
    ? "パスワードを入力してください"
    : "Nhập mật khẩu";
  const passConfLabel = isJP ? "パスワード確認" : "Xác nhận mật khẩu";
  const passConfPlaceholder = isJP
    ? "もう一度パスワードを入力してください"
    : "Nhập lại mật khẩu";
  const submitText = isJP ? "登録" : "Đăng ký";
  const googleText = isJP
    ? "Googleで登録"
    : "Đăng ký bằng Google";
  const bottomText = isJP ? "すでにアカウントをお持ちですか？" : "Đã có tài khoản?";
  const bottomLinkText = isJP ? "ログイン" : "Đăng nhập";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password || !passwordConfirm) {
      setError(
        isJP
          ? "すべての項目を入力してください。"
          : "Vui lòng điền đầy đủ thông tin."
      );
      return;
    }
    if (password !== passwordConfirm) {
      setError(
        isJP
          ? "パスワードと確認用パスワードが一致しません。"
          : "Mật khẩu và xác nhận mật khẩu không trùng nhau."
      );
      return;
    }

    try {
      setLoading(true);
      // TODO: gọi API đăng ký thật
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.message ||
            (isJP ? "登録に失敗しました。" : "Đăng ký thất bại.")
        );
      }

      navigate("/login");
    } catch (err: any) {
      setError(
        err.message ||
          (isJP ? "エラーが発生しました。" : "Có lỗi xảy ra, vui lòng thử lại.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = "/api/auth/google"; // TODO: sửa cho đúng BE
  };

  return (
    <AuthLayout title={title} lang={lang} onChangeLang={setLang}>
      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <TextInput
          label={nameLabel}
          type="text"
          placeholder={namePlaceholder}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

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

        <TextInput
          label={passConfLabel}
          type="password"
          placeholder={passConfPlaceholder}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? (isJP ? "処理中..." : "Đang đăng ký...") : submitText}
        </PrimaryButton>
      </form>

      <button className="google-btn" onClick={handleGoogleRegister}>
        <img src={googleLogo} alt="Google" className="google-icon" />
        <span>{googleText}</span>
      </button>


      <div className="auth-bottom-text">
        {bottomText}{" "}
        <Link to="/login" className="link">
          {bottomLinkText}
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
