
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { apiRequest, getToken } from "../api.js";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!getToken()) {
        navigate("/signin");
        return;
      }

      try {
        const data = await apiRequest("/api/auth/me");

        if (active) {
          setUser(data.user || data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load your profile.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  if (loading) {
    return <div className="page">Loading your career profile...</div>;
  }

  if (!user) {
    return (
      <div className="page">
        <section className="section">
          <div className="container">
            <Card className="profilePro">
              <h2>Profile unavailable</h2>
              <p>{error || "Please sign in to view your profile."}</p>
              <Button onClick={() => navigate("/signin")}>
                Sign In
              </Button>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section">
        <div className="container">
          <Card className="profilePro">
            <div className="profileHeader">
              <div className="avatarXL">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div>
                <h2>{user.name}</h2>
                <p className="email">{user.email}</p>
                <span className="tag">AVORA AI Member</span>
              </div>
            </div>

            <div className="profileGrid">
              <div className="fieldBox">
                <label>Full Name</label>
                <input
                  className="input"
                  value={user.name || ""}
                  readOnly
                />
              </div>

              <div className="fieldBox">
                <label>Email Address</label>
                <input
                  className="input"
                  value={user.email || ""}
                  readOnly
                />
              </div>
            </div>

            <div className="profileActions">
              <Button onClick={() => navigate("/intelligence")}>
                Analyze My Resume
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
