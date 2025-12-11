import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HomePage: React.FC = () => {
    const { user, settings, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    // Style nút đồng nhất
    const buttonStyle: React.CSSProperties = {
        padding: "0.6rem 1.2rem",
        cursor: "pointer",
        border: "none",
        borderRadius: "4px",
        color: "white",
        minWidth: "140px",
        textAlign: "center",
        display: "inline-block",
    };

    const primaryBtn = { ...buttonStyle, backgroundColor: "#667eea" };
    const secondaryBtn = { ...buttonStyle, backgroundColor: "#007bff" };
    const dangerBtn = { ...buttonStyle, backgroundColor: "#dc3545" };

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        setLoading(false);
    };

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

            {/* Các nút hành động */}
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                <button onClick={() => navigate("/profile")} style={primaryBtn}>
                    Go to Profile
                </button>

                <button onClick={() => navigate("/settings")} style={primaryBtn}>
                    Go to Settings
                </button>

                <button onClick={() => navigate("/chat")} style={secondaryBtn}>
                    Go to Chat
                </button>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                disabled={loading}
                style={{
                    ...dangerBtn,
                    marginTop: "1.5rem",
                    opacity: loading ? 0.6 : 1,
                }}
            >
                {loading ? "Logging out..." : "Logout"}
            </button>
        </div>
    );
};

export default HomePage;
