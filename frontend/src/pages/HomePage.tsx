import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HomePage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    console.log("HomePage - user:", user);

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        setLoading(false);
    };

    const handleGoToProfile = () => {
        navigate("/profile");
    };

    const settings = localStorage.getItem("settings")
        ? JSON.parse(localStorage.getItem("settings") || "{}")
        : null;

    return (
        <div style={{ padding: "2rem" }}>
            <header className="auth-header">
                <div className="app-name">Smart Exchange</div>
            </header>
            <h1>Welcome to Smart Exchange</h1>
            <div style={{ marginTop: "1rem" }}>
                <p>
                    <strong>Email:</strong> {user?.email}
                </p>
                <p>
                    <strong>Job Title:</strong> {user?.jobTitle || "N/A"}
                </p>
                <p>
                    <strong>Language:</strong> {settings?.language || "N/A"}
                </p>
                <p>
                    <strong>Theme:</strong> {settings?.theme || "N/A"}
                </p>
            </div>
            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                <button
                    onClick={handleGoToProfile}
                    style={{
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        backgroundColor: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                    }}
                >
                    Go to Profile
                </button>
                <button
                    onClick={handleLogout}
                    disabled={loading}
                    style={{
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                    }}
                >
                    {loading ? "Logging out..." : "Logout"}
                </button>
            </div>
        </div>
    );
};

export default HomePage;
