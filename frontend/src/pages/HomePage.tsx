import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "~/services/api";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = async () => {
        try {
            setLoading(true);
            await authService.logout();

            localStorage.removeItem("user");
            localStorage.removeItem("settings");

            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "2rem" }}>
            <header className="auth-header">
                <div className="app-name">Smart Exchange</div>
            </header>
            <h1>Welcome to Smart Exchange</h1>
            <div style={{ marginTop: "1rem" }}>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>Job Title:</strong> {user.jobTitle || "N/A"}
                </p>
                <p>
                    <strong>Language:</strong>{" "}
                    {localStorage.getItem("settings")
                        ? JSON.parse(localStorage.getItem("settings") || "{}").language
                        : "N/A"}
                </p>
                <p>
                    <strong>Theme:</strong>{" "}
                    {localStorage.getItem("settings")
                        ? JSON.parse(localStorage.getItem("settings") || "{}").theme
                        : "N/A"}
                </p>
            </div>
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
