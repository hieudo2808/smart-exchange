import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
    const { user, settings, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        setLoading(false);
    };

    const handleGoToProfile = () => {
        navigate("/profile");
    };

    return (
        <div style={{ padding: "2rem" }}>
            <header className="auth-header">
                <div className="app-name">Smart Exchange</div>
            </header>

            <h1>Welcome to Smart Exchange</h1>

            <div style={{ marginTop: "1rem" }}>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Job Title:</strong> {user?.jobTitle || "N/A"}</p>
                <p><strong>Language:</strong> {settings?.language || "N/A"}</p>
                <p><strong>Theme:</strong> {settings?.theme || "N/A"}</p>
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
            </div>

            {/* NÚT ĐI ĐẾN TRANG CHAT */}
            <Link
                to="/chat"
                style={{
                    marginTop: "1.5rem",
                    display: "inline-block",
                    padding: "0.6rem 1.2rem",
                    backgroundColor: "#007bff",
                    color: "white",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: "bold",
                }}
            >
                Go to Chat
            </Link>

            <br />

            {/* Logout */}
            <button
                onClick={handleLogout}
                disabled={loading}
                style={{
                    marginTop: "1rem",
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
    );
};

export default HomePage;
