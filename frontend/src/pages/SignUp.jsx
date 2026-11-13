
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { apiRequest } from "../api.js";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      navigate("/signin");
    } catch (err) {
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page authPage">
      <section className="section">
        <div className="container authWrap">
          <Card className="authCard">
            <div className="panelTitle">Create Your Account</div>
            <p className="muted">
              Start building a clearer picture of your career.
            </p>

            {error && <div className="errorBox">{error}</div>}

            <label className="field">
              <span>Full Name</span>
              <input
                className="input"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

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
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Confirm Password</span>
              <input
                className="input"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>

            <Button
              className="authBtn"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="authFooter">
              <span>Already registered?</span>
              <button
                className="linkBtn"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
