import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "~/services/api";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "../styles/ProfilePage.css";
import { useTheme } from "~/contexts/ThemeContext";

interface ProfileFormData {
    email: string;
    career: string;
    position: string;
}

const ProfilePage: React.FC = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState<ProfileFormData>({
        email: "",
        career: "",
        position: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);


   const loadUserData = async () => {
        if (user) {
            try {
                const userData = await userService.getCurrentUser();
                const [career, position] = (userData.jobTitle || "").split(":::").map(s => s.trim());
                setFormData({
                    email: userData.email,
                    career: career || "",
                    position: position || "",
                });
            } catch (err) {
                console.error("Failed to load user data:", err);
            }
        }
    };

    useEffect(() => {
        loadUserData();
    }, [user?.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!user) {
            setError(t("profile.errorNotAuthenticated"));
            return;
        }

        try {
            setLoading(true);
            const jobTitle = `${formData.career}:::${formData.position}`;
            await userService.updateUser(user.id, {
                jobTitle: jobTitle,
            });
            setSuccess(true);
            // Hide success message after 2 seconds
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            console.error("Update error:", err);
            const error = err as Error;
            setError(error?.message || t("profile.errorUpdateFailed"));
        } finally {
            setLoading(false);
        }
    };

    const handleBackToSettings = () => {
        navigate("/settings");
    };

    return (
        <div className="profile-page">
            {/* Header */}
            <header className="profile-header">
                <div className="profile-app-name">Smart Exchange</div>
                <LanguageSwitcher />
            </header>

            {/* Main Content */}
            <main className="profile-main">
                <div className="profile-container">
                    {/* Title */}
                    <h1 className="profile-title">{t("profile.title")}</h1>

                    {/* Error Message */}
                    {error && <div className="profile-error">{error}</div>}

                    {/* Success Message */}
                    {success && (
                        <div className="profile-success">{t("profile.successMessage")}</div>
                    )}

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="profile-form">
                        {/* Email Display (Read-only) */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label-jp">
                                {t("profile.emailLabel")}
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                disabled
                                className="form-input-readonly"
                            />
                        </div>

                        {/* Career & Position Sections - Each Row with Button */}
                        <div className="form-column-left">
                            {/* Career Row - Textarea + Button */}
                            <div className="form-item-row">
                                <div className="form-group form-group-inline">
                                    <label htmlFor="career" className="form-label-jp">
                                        {t("profile.careerLabel")}
                                    </label>
                                    <textarea
                                        id="career"
                                        name="career"
                                        value={formData.career}
                                        onChange={handleInputChange}
                                        placeholder={t("profile.careerPlaceholder")}
                                        className="form-textarea"
                                        rows={2}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn-update-individual"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        if (!user) {
                                            setError(t("profile.errorNotAuthenticated"));
                                            return;
                                        }
                                        try {
                                            setLoading(true);
                                            await userService.updateJobInfo(user.id, {
                                                career: formData.career,
                                                position: formData.position,
                                            });
                                            setSuccess(true);
                                            setTimeout(() => setSuccess(false), 2000);
                                        } catch (err) {
                                            setError(t("profile.errorUpdateFailed"));
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={loading}
                                >
                                    {t("profile.updateButton")}
                                </button>
                            </div>

                            {/* Position Row - Textarea + Button */}
                            <div className="form-item-row">
                                <div className="form-group form-group-inline">
                                    <label htmlFor="position" className="form-label-jp">
                                        {t("profile.positionLabel")}
                                    </label>
                                    <textarea
                                        id="position"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        placeholder={t("profile.positionPlaceholder")}
                                        className="form-textarea"
                                        rows={2}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn-update-individual"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        if (!user) {
                                            setError(t("profile.errorNotAuthenticated"));
                                            return;
                                        }
                                        try {
                                            setLoading(true);
                                            await userService.updateJobInfo(user.id, {
                                                career: formData.career,
                                                position: formData.position,
                                            });
                                            setSuccess(true);
                                            setTimeout(() => setSuccess(false), 2000);
                                        } catch (err) {
                                            setError(t("profile.errorUpdateFailed"));
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={loading}
                                >
                                    {t("profile.updateButton")}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Back to Settings Button */}
                    <div className="profile-footer">
                        <button
                            type="button"
                            className="btn-settings-back"
                            onClick={handleBackToSettings}
                        >
                            {t("profile.settingsBackButton")}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
