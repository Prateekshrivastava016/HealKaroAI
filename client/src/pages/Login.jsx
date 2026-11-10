import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginUser({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell login-shell">
      {/* Decorative background */}
      <div className="auth-orb auth-orb-one"></div>
      <div className="auth-orb auth-orb-two"></div>

      {/* Left branding panel */}
      <section className="auth-visual">
        <Link to="/" className="brand-logo">
          <span className="brand-icon">✚</span>
          <span>
            HealKaro<span className="brand-highlight">AI</span>
          </span>
        </Link>

        <div className="visual-content">
          <div className="visual-badge">
            <span className="status-dot"></span>
            YOUR HEALTH. YOUR FUTURE.
          </div>

          <h1>
            Better health
            <br />
            starts with
            <br />
            <span>you.</span>
          </h1>

          <p className="visual-description">
            Your personal health companion, powered by AI.
            Understand your body, build healthier habits, and
            take control of your everyday wellbeing.
          </p>

          <div className="visual-feature-list">
            <div className="visual-feature">
              <span className="feature-icon">♡</span>
              <div>
                <strong>Personalized health insights</strong>
                <small>Insights tailored to your profile</small>
              </div>
            </div>

            <div className="visual-feature">
              <span className="feature-icon">✧</span>
              <div>
                <strong>AI-powered assistance</strong>
                <small>Smarter support for your health goals</small>
              </div>
            </div>
          </div>
        </div>

        <div className="visual-footer">
          <span>Designed around you.</span>
          <span>HEALKAROAI © 2026</span>
        </div>
      </section>

      {/* Right login panel */}
      <section className="auth-form-section">
        <div className="auth-mobile-brand">
          <span className="brand-icon">✚</span>
          HealKaro<span className="brand-highlight">AI</span>
        </div>

        <div className="auth-card login-card">
          <div className="form-eyebrow">
            <span className="eyebrow-line"></span>
            WELCOME BACK
          </div>

          <h2>Good to see you.</h2>

          <p className="form-description">
            Sign in to continue your health journey.
          </p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="login-email">Email address</label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="label-row">
                <label htmlFor="login-password">Password</label>
              </div>

              <div className="input-wrapper">
                <span className="input-icon">⌑</span>

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                <span>!</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              <span>{loading ? "Signing you in..." : "Sign in"}</span>
              {!loading && <span className="button-arrow">↗</span>}
            </button>
          </form>

          <div className="auth-divider">
            <span></span>
            <small>YOUR HEALTH JOURNEY AWAITS</small>
            <span></span>
          </div>

          <p className="auth-switch">
            New to HealKaroAI?
            <Link to="/register"> Create your account ↗</Link>
          </p>

          <Link to="/" className="back-home">
            ← Back to home
          </Link>
        </div>

        <p className="auth-legal">
          Your health journey, designed around you.
        </p>
      </section>
    </main>
  );
}

export default Login;