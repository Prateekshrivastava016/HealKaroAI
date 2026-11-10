import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../services/authService";
import api from "../services/api";
import "./Profile.css";

const initialForm = {
  name: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  activityLevel: "",
  goal: "",
  dietaryPreference: "",
};

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getUserProfile();
        const userData = response?.user || response?.data || response;

        if (!userData || typeof userData !== "object") {
          throw new Error("Invalid profile response");
        }

        setUser(userData);
        setForm({
          name: userData.name ?? "",
          age: userData.age ?? "",
          gender: userData.gender ?? "",
          height: userData.height ?? "",
          weight: userData.weight ?? "",
          activityLevel: userData.activityLevel ?? "",
          goal: userData.goal ?? "",
          dietaryPreference: userData.dietaryPreference ?? "",
        });
      } catch (err) {
        console.error("Profile loading error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const calculateBMI = () => {
    const height = Number(user?.height);
    const weight = Number(user?.weight);

    if (!height || !weight || height <= 0 || weight <= 0) {
      return null;
    }

    return Number((weight / Math.pow(height / 100, 2)).toFixed(1));
  };

  const getBMIStatus = (bmi) => {
    if (bmi === null) return "Not available";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Healthy range";
    if (bmi < 30) return "Overweight";
    return "Obesity range";
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const formatValue = (value, suffix = "") => {
    if (value === undefined || value === null || value === "") {
      return "Not provided";
    }

    return `${value}${suffix}`;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleEdit = () => {
    setForm({
      name: user.name ?? "",
      age: user.age ?? "",
      gender: user.gender ?? "",
      height: user.height ?? "",
      weight: user.weight ?? "",
      activityLevel: user.activityLevel ?? "",
      goal: user.goal ?? "",
      dietaryPreference: user.dietaryPreference ?? "",
    });
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm({
      name: user.name ?? "",
      age: user.age ?? "",
      gender: user.gender ?? "",
      height: user.height ?? "",
      weight: user.weight ?? "",
      activityLevel: user.activityLevel ?? "",
      goal: user.goal ?? "",
      dietaryPreference: user.dietaryPreference ?? "",
    });
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    const age = Number(form.age);
    const height = Number(form.height);
    const weight = Number(form.weight);

    if (!form.age || !Number.isFinite(age) || age < 1 || age > 120) {
      setError("Please enter a valid age between 1 and 120.");
      return;
    }

    if (
      !form.height ||
      !Number.isFinite(height) ||
      height <= 0 ||
      height > 300
    ) {
      setError("Please enter a valid height in centimeters.");
      return;
    }

    if (
      !form.weight ||
      !Number.isFinite(weight) ||
      weight <= 0 ||
      weight > 700
    ) {
      setError("Please enter a valid weight in kilograms.");
      return;
    }

    try {
      setSaving(true);
      const response = await api.put("/profile", {
        name: form.name.trim(),
        age,
        height,
        weight,
        gender: form.gender,
        activityLevel: form.activityLevel,
        goal: form.goal,
        dietaryPreference: form.dietaryPreference,
      });

      const updatedUser = response.data?.data || response.data?.user;
      if (!updatedUser) {
        throw new Error(
          "Profile may have been saved, but the updated details were not returned."
        );
      }

      setUser(updatedUser);
      setForm({
        name: updatedUser.name ?? "",
        age: updatedUser.age ?? "",
        gender: updatedUser.gender ?? "",
        height: updatedUser.height ?? "",
        weight: updatedUser.weight ?? "",
        activityLevel: updatedUser.activityLevel ?? "",
        goal: updatedUser.goal ?? "",
        dietaryPreference: updatedUser.dietaryPreference ?? "",
      });
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const detailItems = user
    ? [
        { label: "Age", value: formatValue(user.age, " years"), icon: "🎂" },
        { label: "Gender", value: formatValue(user.gender), icon: "👤" },
        { label: "Height", value: formatValue(user.height, " cm"), icon: "📏" },
        { label: "Weight", value: formatValue(user.weight, " kg"), icon: "⚖️" },
        {
          label: "Activity Level",
          value: formatValue(user.activityLevel),
          icon: "🏃",
        },
        { label: "Fitness Goal", value: formatValue(user.goal), icon: "🎯" },
        {
          label: "Dietary Preference",
          value: formatValue(user.dietaryPreference),
          icon: "🥗",
        },
      ]
    : [];

  const bmi = calculateBMI();
  const bmiTone =
    bmi === null
      ? "tone-none"
      : bmi < 18.5
        ? "tone-under"
        : bmi < 25
          ? "tone-normal"
          : bmi < 30
            ? "tone-over"
            : "tone-obese";
  const bmiMarker = bmi === null ? 0 : Math.min(Math.max((bmi / 40) * 100, 0), 100);

  if (loading) {
    return (
      <div className="profile-page">
        <main className="profile-container">
          <div className="profile-message" role="status">
            <div className="spinner" />
            <h2>Loading your profile...</h2>
            <p>Please wait while we fetch your details.</p>
          </div>
        </main>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="profile-page">
        <main className="profile-container">
          <div className="profile-message">
            <div className="message-icon" aria-hidden="true">!</div>
            <h2>Unable to load profile</h2>
            <p>{error}</p>
            <div className="message-actions">
              <button
                className="btn btn-ghost"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="profile-page">
      <header className="profile-topbar">
        <h2 className="profile-brand">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>HealKaroAI</span>
        </h2>
        <button
          className="btn btn-ghost"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </header>

      <main className="profile-container">
        <h1 className="profile-heading">My Profile</h1>
        <p className="profile-subtitle">
          Manage your personal information and view your health details.
        </p>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" role="status">
            ✓ {success}
          </div>
        )}

        <section className="profile-hero">
          <div className="avatar" aria-hidden="true">
            {getInitials(user.name)}
          </div>
          <div className="hero-text">
            <h2>{user.name || "HealKaroAI User"}</h2>
            <p>{user.email || "Email not provided"}</p>
            <span className="badge">✓ Registered User</span>
          </div>
          {!isEditing && (
            <button className="btn btn-light" onClick={handleEdit}>
              ✏️ Edit Profile
            </button>
          )}
        </section>

        {isEditing ? (
          <section className="card">
            <h2 className="section-title">
              ✏️ Edit Personal &amp; Health Information
            </h2>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                  />
                </div>
                <div className="field">
                  <label htmlFor="age">Age</label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    value={form.age}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="height">Height (cm)</label>
                  <input
                    id="height"
                    name="height"
                    type="number"
                    min="1"
                    max="300"
                    step="0.1"
                    value={form.height}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    min="0.1"
                    max="700"
                    step="0.1"
                    value={form.weight}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="activityLevel">Activity Level</label>
                  <select
                    id="activityLevel"
                    name="activityLevel"
                    value={form.activityLevel}
                    onChange={handleChange}
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="lightly_active">Lightly Active</option>
                    <option value="moderately_active">
                      Moderately Active
                    </option>
                    <option value="very_active">Very Active</option>
                    <option value="extra_active">Extra Active</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="goal">Fitness Goal</label>
                  <select
                    id="goal"
                    name="goal"
                    value={form.goal}
                    onChange={handleChange}
                  >
                    <option value="">Select fitness goal</option>
                    <option value="lose_weight">Lose Weight</option>
                    <option value="maintain_weight">Maintain Weight</option>
                    <option value="gain_weight">Gain Weight</option>
                    <option value="build_muscle">Build Muscle</option>
                    <option value="improve_fitness">Improve Fitness</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="dietaryPreference">Dietary Preference</label>
                  <select
                    id="dietaryPreference"
                    name="dietaryPreference"
                    value={form.dietaryPreference}
                    onChange={handleChange}
                  >
                    <option value="">Select dietary preference</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="non_vegetarian">Non-vegetarian</option>
                    <option value="eggetarian">Eggetarian</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "💾 Save Changes"}
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : (
          <div className="profile-layout">
            <section className="card">
              <h2 className="section-title">
                👤 Personal &amp; Health Information
              </h2>
              <div className="detail-grid">
                {detailItems.map((item) => (
                  <div className="detail-box" key={item.label}>
                    <span className="detail-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <div>
                      <div className="detail-label">{item.label}</div>
                      <div className="detail-value">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card bmi-card">
              <h2 className="section-title">📊 Body Mass Index</h2>
              <p className="muted">
                Calculated from your recorded height and weight.
              </p>
              <div className="bmi-value">{bmi ?? "--"}</div>
              <span className={`bmi-status ${bmiTone}`}>
                {getBMIStatus(bmi)}
              </span>
              {bmi === null ? (
                <p className="muted small">
                  Add valid height and weight details to calculate your BMI.
                </p>
              ) : (
                <div className="bmi-scale" aria-label="BMI scale">
                  <div className="bmi-track">
                    <span
                      className="bmi-marker"
                      style={{ left: `${bmiMarker}%` }}
                    />
                  </div>
                  <div className="bmi-legend">
                    <span>Low</span>
                    <span>Healthy</span>
                    <span>High</span>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        <footer className="profile-footer">
          HealKaroAI · AI-Powered Personal Health Monitoring System
        </footer>
      </main>
    </div>
  );
}

export default Profile;
