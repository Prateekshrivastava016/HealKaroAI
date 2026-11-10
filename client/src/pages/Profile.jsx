import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

  // Load logged-in user's profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        // Existing authentication endpoint
        const response = await api.get("/auth/me");

        const userData =
          response.data?.user ||
          response.data?.data ||
          response.data;

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

  // Calculate BMI
  const calculateBMI = () => {
    const height = Number(user?.height);
    const weight = Number(user?.weight);

    if (!height || !weight || height <= 0 || weight <= 0) {
      return null;
    }

    return (weight / Math.pow(height / 100, 2)).toFixed(1);
  };

  const getBMIStatus = (bmi) => {
    if (bmi === null) return "Not available";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
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

  // Update form fields
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Start editing
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

  // Cancel editing
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

  // Save updated profile
  const handleSave = async (event) => {
    event.preventDefault();

   alert("Save button clicked!");

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

      const payload = {
        name: form.name.trim(),
        age,
        height,
        weight,
        gender: form.gender,
        activityLevel: form.activityLevel,
        goal: form.goal,
        dietaryPreference: form.dietaryPreference,
      };

      // Authenticated PUT request
      const response = await api.put("/profile", payload);

      const updatedUser =
        response.data?.data ||
        response.data?.user;

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

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f4f7f6",
      padding: "30px 16px",
      fontFamily: "Arial, sans-serif",
      boxSizing: "border-box",
      color: "#18352c",
    },
    container: {
      maxWidth: "1000px",
      margin: "0 auto",
    },
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
      marginBottom: "28px",
    },
    brand: {
      fontSize: "24px",
      fontWeight: "800",
      color: "#167d57",
      margin: 0,
    },
    button: {
      padding: "11px 18px",
      border: "1px solid #d5e5dc",
      borderRadius: "10px",
      background: "#ffffff",
      color: "#167d57",
      fontWeight: "600",
      cursor: "pointer",
    },
    primaryButton: {
      padding: "12px 20px",
      border: "none",
      borderRadius: "10px",
      background: "#167d57",
      color: "#ffffff",
      fontWeight: "700",
      cursor: "pointer",
    },
    heading: {
      fontSize: "30px",
      margin: "0 0 8px",
    },
    subtitle: {
      color: "#718078",
      margin: "0 0 25px",
      lineHeight: 1.6,
    },
    card: {
      background: "#ffffff",
      borderRadius: "18px",
      padding: "24px",
      marginBottom: "22px",
      boxShadow: "0 5px 25px rgba(20, 70, 50, 0.06)",
      border: "1px solid #e7eee9",
      boxSizing: "border-box",
    },
    profileHeader: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      flexWrap: "wrap",
    },
    avatar: {
      width: "85px",
      height: "85px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #16865d, #72c9a3)",
      color: "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "28px",
      fontWeight: "800",
      flexShrink: 0,
    },
    userName: {
      fontSize: "24px",
      margin: "0 0 7px",
      overflowWrap: "anywhere",
    },
    email: {
      color: "#718078",
      margin: 0,
      overflowWrap: "anywhere",
    },
    badge: {
      display: "inline-block",
      background: "#e7f7ee",
      color: "#167d57",
      padding: "7px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "700",
      marginTop: "12px",
    },
    sectionTitle: {
      fontSize: "20px",
      margin: "0 0 20px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
      gap: "15px",
    },
    detailBox: {
      padding: "17px",
      background: "#f8fbf9",
      border: "1px solid #e7eee9",
      borderRadius: "13px",
      minWidth: 0,
    },
    detailLabel: {
      color: "#78867e",
      fontSize: "13px",
      marginBottom: "9px",
    },
    detailValue: {
      color: "#203a30",
      fontSize: "16px",
      fontWeight: "700",
      overflowWrap: "anywhere",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      minWidth: 0,
    },
    label: {
      fontSize: "13px",
      color: "#52665b",
      fontWeight: "700",
    },
    input: {
      width: "100%",
      minWidth: 0,
      boxSizing: "border-box",
      padding: "12px",
      border: "1px solid #d5e5dc",
      borderRadius: "9px",
      background: "#ffffff",
      color: "#18352c",
      fontSize: "14px",
      outlineColor: "#167d57",
    },
    bmiValue: {
      fontSize: "36px",
      fontWeight: "800",
      color: "#167d57",
      margin: "12px 0 6px",
    },
    message: {
      textAlign: "center",
      padding: "40px 20px",
      background: "#ffffff",
      borderRadius: "16px",
      color: "#52665b",
      lineHeight: 1.7,
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.message}>
            <h2>Loading your profile...</h2>
            <p>Please wait while we fetch your details.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.message}>
            <h2>Unable to Load Profile</h2>
            <p>{error}</p>

            <button
              style={styles.button}
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>

            <button
              style={{ ...styles.primaryButton, marginLeft: "10px" }}
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const bmi = calculateBMI();

  const detailItems = [
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
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <h2 style={styles.brand}>HealKaroAI</h2>

          <button
            style={styles.button}
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

        <h1 style={styles.heading}>My Profile</h1>

        <p style={styles.subtitle}>
          Manage your personal information and view your health details.
        </p>

        {error && (
          <div
            role="alert"
            style={{
              padding: "13px 16px",
              borderRadius: "10px",
              background: "#fff0ef",
              color: "#a52b24",
              marginBottom: "18px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            style={{
              padding: "13px 16px",
              borderRadius: "10px",
              background: "#e7f7ee",
              color: "#167d57",
              marginBottom: "18px",
            }}
          >
            ✓ {success}
          </div>
        )}

        {/* User header */}
        <section style={styles.card}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>
              {getInitials(user.name)}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 style={styles.userName}>
                {user.name || "HealKaroAI User"}
              </h2>

              <p style={styles.email}>
                {user.email || "Email not provided"}
              </p>

              <span style={styles.badge}>✓ Registered User</span>
            </div>

            {!isEditing && (
              <button
                style={styles.primaryButton}
                onClick={handleEdit}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        </section>

        {/* Edit form */}
        {isEditing ? (
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>
              ✏️ Edit Personal & Health Information
            </h2>

            <form onSubmit={handleSave}>
              <div style={styles.grid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label} htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    style={styles.input}
                    value={form.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label} htmlFor="age">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    style={styles.input}
                    value={form.age}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label} htmlFor="gender">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    style={styles.input}
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label} htmlFor="height">
                    Height (cm)
                  </label>
                  <input
                    id="height"
                    name="height"
                    type="number"
                    min="1"
                    max="300"
                    step="0.1"
                    style={styles.input}
                    value={form.height}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label} htmlFor="weight">
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    min="0.1"
                    max="700"
                    step="0.1"
                    style={styles.input}
                    value={form.weight}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label} htmlFor="activityLevel">
                    Activity Level
                  </label>
                  <select
                    id="activityLevel"
                    name="activityLevel"
                    style={styles.input}
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

                <div style={styles.inputGroup}>
                  <label style={styles.label} htmlFor="goal">
                    Fitness Goal
                  </label>
                  <select
                    id="goal"
                    name="goal"
                    style={styles.input}
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

                <div style={styles.inputGroup}>
                  <label style={styles.label} htmlFor="dietaryPreference">
                    Dietary Preference
                  </label>
                  <select
                    id="dietaryPreference"
                    name="dietaryPreference"
                    style={styles.input}
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

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "24px",
                }}
              >
                <button
                  type="submit"
                  onClick={() => alert("Save button clicked!")}
                  style={{
                   ...styles.primaryButton,
                  opacity: saving ? 0.7 : 1,
                   }}
                   disabled={saving}
>
                  {saving ? "Saving..." : "💾 Save Changes"}
                </button>

                <button
                  type="button"
                  style={styles.button}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : (
          <>
            {/* Personal details */}
            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>
                👤 Personal & Health Information
              </h2>

              <div style={styles.grid}>
                {detailItems.map((item) => (
                  <div key={item.label} style={styles.detailBox}>
                    <div style={styles.detailLabel}>
                      {item.icon} {item.label}
                    </div>

                    <div style={styles.detailValue}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* BMI */}
            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>
                📊 Body Mass Index (BMI)
              </h2>

              <p style={{ color: "#718078", margin: 0 }}>
                BMI is calculated from your recorded height and weight.
              </p>

              <div style={styles.bmiValue}>{bmi || "--"}</div>

              <p style={{ margin: 0, fontWeight: "600" }}>
                {getBMIStatus(bmi === null ? null : Number(bmi))}
              </p>

              {!bmi && (
                <p style={{ color: "#718078", fontSize: "13px" }}>
                  Add valid height and weight details to calculate BMI.
                </p>
              )}
            </section>
          </>
        )}

        <p
          style={{
            textAlign: "center",
            color: "#89958e",
            fontSize: "13px",
            padding: "10px 0",
          }}
        >
          HealKaroAI · AI-Powered Personal Health Monitoring System
        </p>
      </div>
    </div>
  );
}

export default Profile;