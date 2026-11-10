import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "male",
    height: "",
    weight: "",
    activityLevel: "sedentary",
    goal: "maintain_weight",
    dietaryPreference: "vegetarian",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = {
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
      };

      await registerUser(userData);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell register-shell">
      <div className="auth-orb auth-orb-one"></div>
      <div className="auth-orb auth-orb-two"></div>

      {/* Branding panel */}
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
            YOUR JOURNEY STARTS HERE
          </div>

          <h1>
            Meet the
            <br />
            healthier
            <br />
            <span>you.</span>
          </h1>

          <p className="visual-description">
            One simple step towards understanding your body
            better. Create your profile and start building
            healthier habits with personalized insights.
          </p>

          <div className="register-quote">
            <div className="quote-mark">“</div>
            <p>
              Small steps every day lead to meaningful
              changes over time.
            </p>
            <span>YOUR HEALTH, YOUR PACE</span>
          </div>
        </div>

        <div className="visual-footer">
          <span>Start small. Stay consistent.</span>
          <span>HEALKAROAI © 2026</span>
        </div>
      </section>

      {/* Registration form */}
      <section className="auth-form-section register-form-section">
        <div className="auth-mobile-brand">
          <span className="brand-icon">✚</span>
          HealKaro<span className="brand-highlight">AI</span>
        </div>

        <div className="auth-card register-card">
          <div className="form-eyebrow">
            <span className="eyebrow-line"></span>
            CREATE YOUR ACCOUNT
          </div>

          <h2>Let's get started.</h2>

          <p className="form-description">
            Tell us a little about yourself to personalize
            your health experience.
          </p>

          <form onSubmit={handleRegister}>
            <div className="register-grid">
              <div className="input-group full-width">
                <label htmlFor="register-name">Full name</label>

                <div className="input-wrapper">
                  <span className="input-icon">♙</span>

                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div className="input-group full-width">
                <label htmlFor="register-email">Email address</label>

                <div className="input-wrapper">
                  <span className="input-icon">✉</span>

                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="input-group full-width">
                <label htmlFor="register-password">Create password</label>

                <div className="input-wrapper">
                  <span className="input-icon">⌑</span>

                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={6}
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

              <div className="input-group">
                <label htmlFor="register-age">Age</label>

                <div className="input-wrapper">
                  <input
                    id="register-age"
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="register-gender">Gender</label>

                <div className="input-wrapper select-wrapper">
                  <select
                    id="register-gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="register-height">Height (cm)</label>

                <div className="input-wrapper">
                  <input
                    id="register-height"
                    name="height"
                    type="number"
                    min="1"
                    max="300"
                    placeholder="e.g. 175"
                    value={formData.height}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="register-weight">Weight (kg)</label>

                <div className="input-wrapper">
                  <input
                    id="register-weight"
                    name="weight"
                    type="number"
                    min="1"
                    max="500"
                    step="0.1"
                    placeholder="e.g. 70"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group full-width">
                <label htmlFor="register-activity">Activity level</label>

                <div className="input-wrapper select-wrapper">
                  <select
                    id="register-activity"
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    required
                  >
                    <option value="sedentary">
                      Sedentary — Mostly sitting
                    </option>
                    <option value="lightly_active">
                      Lightly active
                    </option>
                    <option value="moderately_active">
                      Moderately active
                    </option>
                    <option value="very_active">
                      Very active
                    </option>
                    <option value="extra_active">
                      Extra active
                    </option>
                  </select>
                </div>
              </div>

              <div className="input-group full-width">
                <label htmlFor="register-goal">Your health goal</label>

                <div className="input-wrapper select-wrapper">
                  <select
                    id="register-goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    required
                  >
                    <option value="maintain_weight">
                      Maintain current weight
                    </option>
                    <option value="gain_weight">
                      Gain weight
                    </option>
                    <option value="lose_weight">
                      Lose weight
                    </option>
                  </select>
                </div>
              </div>

              <div className="input-group full-width">
                <label htmlFor="register-diet">Dietary preference</label>

                <div className="input-wrapper select-wrapper">
                  <select
                    id="register-diet"
                    name="dietaryPreference"
                    value={formData.dietaryPreference}
                    onChange={handleChange}
                    required
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non_vegetarian">
                      Non-vegetarian
                    </option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
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
              <span>
                {loading ? "Creating your account..." : "Create account"}
              </span>

              {!loading && <span className="button-arrow">↗</span>}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?
            <Link to="/login"> Sign in ↗</Link>
          </p>

          <Link to="/" className="back-home">
            ← Back to home
          </Link>
        </div>

        <p className="auth-legal">
          Your information is used to personalize your experience.
        </p>
      </section>
    </main>
  );
}

export default Register;