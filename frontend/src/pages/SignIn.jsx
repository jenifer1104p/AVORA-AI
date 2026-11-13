
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { apiRequest } from "../api.js";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      localStorage.setItem("avoraToken", data.token);
      localStorage.setItem("avoraUser", JSON.stringify(data.user));

      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page authPage">
      <section className="section">
        <div className="container authWrap">
          <Card className="authCard">
            <div className="panelTitle">Welcome Back</div>
            <p className="muted">
              Sign in to continue your career journey with AVORA AI.
            </p>

            {error && <div className="errorBox">{error}</div>}

            <label className="field">
              <span>Email</span>
              <input
                className="input"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                className="input"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <Button
              className="authBtn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="authFooter">
              <span>Don't have an account?</span>
              <button
                className="linkBtn"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
