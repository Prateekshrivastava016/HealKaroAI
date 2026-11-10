import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserProfile } from "../services/authService";
import { calculateHealth } from "../services/healthService";
import {getTodayWaterIntake,addWaterIntake,} from "../services/waterService";
import {addSleepRecord,getSleepRecord,} from "../services/sleepService";
import {ResponsiveContainer,BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,} from "recharts";
import {addFoodEntry, getFoodEntries, deleteFoodEntry,} from "../services/foodService";
import {addExercise, getExercises, deleteExercise,} from "../services/exerciseService";
import {addWeight, getWeights, deleteWeight,} from "../services/weightService";
import {generateDietPlan, getSavedDietPlan,} from "../services/aiService";
import {generateWorkoutPlan, getSavedWorkoutPlan,} from "../services/aiWorkoutService";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [healthData, setHealthData] = useState(null);
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterLoading,setWaterLoading] = useState(false);
  const [waterError, setWaterError] = useState("");
  const [sleepTime, setSleepTime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepDuration, setSleepDuration] = useState(0);
  const [sleepLoading, setSleepLoading] = useState(false);
  const [sleepError, setSleepError] = useState("");
  // Food Tracker States
const [foodEntries, setFoodEntries] = useState([]);
const [foodTotals, setFoodTotals] = useState({
  calories: 0,
  protein: 0,
  carbohydrates: 0,
  fat: 0,
});
const [foodForm, setFoodForm] = useState({
  foodName: "",
  quantity: 100,
  calories: "",
  protein: "",
  carbohydrates: "",
  fat: "",
  mealType: "Breakfast",
});
const [foodLoading, setFoodLoading] = useState(false);
const [foodMessage, setFoodMessage] = useState("");

// AI Diet Assistant States
const [dietForm, setDietForm] = useState({
  age: "",
  gender: "male",
  height: "",
  weight: "",
  activityLevel: "moderately_active",
  goal: "weight_gain",
  dietaryPreference: "vegetarian",
  dailyCalorieTarget: "",
});

const [dietPlan, setDietPlan] = useState("");
const [dietLoading, setDietLoading] = useState(false);
const [dietError, setDietError] = useState("");

const [weights, setWeights] = useState([]);

const [weightForm, setWeightForm] = useState({
  weight: "",
});

const [weightMessage, setWeightMessage] = useState("");

const [workoutForm, setWorkoutForm] = useState({
  age: "",
  gender: "male",
  height: "",
  weight: "",
  fitnessLevel: "beginner",
  goal: "muscle_gain",
  workoutLocation: "home",
  availableDays: "5",
});

const [workoutPlan, setWorkoutPlan] = useState("");
const [workoutLoading, setWorkoutLoading] = useState(false);
const [workoutError, setWorkoutError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError("");
        const response = await getUserProfile();

        // Backend response: { message, data: user }
        const profile = response.data || response.user || response;
        setUser(profile);
        const metricsResponse = await calculateHealth({
        weight: Number(profile.weight),
         height: Number(profile.height),
          age: Number(profile.age),
          gender: profile.gender,
         activityLevel: profile.activityLevel,
        goal: profile.goal,
});

setHealthData(metricsResponse.data);
      } catch (err) {
  console.error("DASHBOARD PROFILE ERROR:", {
    message: err.message,
    status: err.response?.status,
    data: err.response?.data,
  });

  setError(
    err.response?.data?.message || err.message
  );
} finally {
        setLoading(false);
      }
    };

    fetchProfile();
    loadFoodEntries();
    loadExercises();
    loadWeights();
  }, []);

useEffect(() => {
  const fetchSavedDietPlan = async () => {
    try {
      const response = await getSavedDietPlan();
      setDietPlan(response.dietPlan || "");
    } catch (error) {
      console.error("Saved Diet Plan Error:", error);
    }
  };

  fetchSavedDietPlan();
}, []);

useEffect(() => {
  const fetchSavedWorkoutPlan = async () => {
    try {
      const response = await getSavedWorkoutPlan();
      setWorkoutPlan(response.workoutPlan || "");
    } catch (error) {
      console.error("Saved Workout Plan Error:", error);
    }
  };

  fetchSavedWorkoutPlan();
}, []);

  useEffect(() => {
  const fetchWaterIntake = async () => {
    try {
      setWaterError("");

      const response = await getTodayWaterIntake();
      setWaterIntake(response.totalIntake || 0);
    } catch (err) {
      setWaterError(
        err.response?.data?.message ||
          "Unable to load today's water intake."
      );
    }
  };

  fetchWaterIntake();
}, []);
 useEffect(() => {
  const fetchSleepRecord = async () => {
    try {
      setSleepError("");

      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());

      const response = await getSleepRecord(today);

      const record = response.data?.data || response.data;

      if (record?.duration != null) {
        setSleepDuration(Number(record.duration));
      } else {
        setSleepDuration(0);
      }
    } catch (err) {
      setSleepError(
        err.response?.data?.message ||
          "Unable to load today's sleep record."
      );
    }
  };

  fetchSleepRecord();
}, []);

  const handleAddWater = async (amount) => {
  try {
    setWaterLoading(true);
    setWaterError("");

    await addWaterIntake(amount);

    const response = await getTodayWaterIntake();
    setWaterIntake(response.totalIntake || 0);
  } catch (err) {
    setWaterError(
      err.response?.data?.message ||
        "Unable to save water intake. Please try again."
    );
  } finally {
    setWaterLoading(false);
  }
};
const calculateSleepDuration = (start, end) => {
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);

  const startTotal = startHours * 60 + startMinutes;
  let endTotal = endHours * 60 + endMinutes;

  if (endTotal <= startTotal) {
    endTotal += 24 * 60;
  }

  return Number(((endTotal - startTotal) / 60).toFixed(2));
};

const handleSaveSleep = async () => {
  try {
    setSleepLoading(true);
    setSleepError("");

    const duration = calculateSleepDuration(sleepTime, wakeTime);

    if (duration <= 0 || duration > 24) {
      setSleepError("Please enter a valid sleep duration.");
      return;
    }

    const now = new Date();

const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})
  .format(now);

    const response = await addSleepRecord({
      sleepTime,
      wakeTime,
      date: today,
    });

    setSleepDuration(response.data.duration);
  } catch (err) {
    setSleepError(
      err.response?.data?.message ||
        "Unable to save sleep record. Please try again."
    );
  } finally {
    setSleepLoading(false);
  }
};

const [exercises, setExercises] = useState([]);

const [exerciseForm, setExerciseForm] = useState({
  exerciseName: "",
  exerciseType: "Cardio",
  duration: "",
  caloriesBurned: "",
});

const [exerciseTotals, setExerciseTotals] = useState({
  totalDuration: 0,
  totalCaloriesBurned: 0,
});

  const height = Number(user?.height);
  const weight = Number(user?.weight);

  const bmi =
    height > 0 && weight > 0
      ? (weight / (height / 100) ** 2).toFixed(1)
      : "--";

  const healthCards = [
  {
    icon: "⚖️",
    title: "Body Mass Index",
    value: bmi ?? "--",
    unit: bmi != null ? "kg/m²" : "",
    description: "Calculated from your profile",
  },
  {
    icon: "🔥",
    title: "BMR",
    value: healthData?.bmr ?? "--",
    unit: healthData ? "kcal/day" : "",
    description: "Calories burned at rest",
  },
  {
    icon: "⚡",
    title: "TDEE",
    value: healthData?.tdee ?? "--",
    unit: healthData ? "kcal/day" : "",
    description: "Estimated daily energy expenditure",
  },
  {
    icon: "🎯",
    title: "Daily Calorie Target",
    value: healthData?.dailyCalorieTarget ?? "--",
    unit: healthData ? "kcal/day" : "",
    description: "Based on your selected goal",
  },
  {
    icon: "💧",
    title: "Water Intake",
    value: waterIntake,
    unit: "ml",
    description: "Today's water consumption",
  },
 {
  icon: "😴",
  title: "Sleep Tracking",
  value: sleepDuration > 0 ? sleepDuration : "--",
  unit: "hours",
  description: "Your recorded sleep duration",
},
];
const waterGoal = 2500;
const sleepGoal = 8;

const waterProgress = Math.min(
  Math.round((waterIntake / waterGoal) * 100),
  100
);

const sleepProgress = Math.min(
  Math.round((sleepDuration / sleepGoal) * 100),
  100
);

const goals = [
  {
    title: "💧 Water Intake",
    current: `${waterIntake} ml`,
    target: `${waterGoal} ml`,
    progress: waterProgress,
  },
  {
    title: "😴 Sleep",
    current: `${sleepDuration} hours`,
    target: `${sleepGoal} hours`,
    progress: sleepProgress,
  },
];

const overallProgress = Math.round(
  goals.reduce((total, goal) => total + goal.progress, 0) /
    goals.length
);

const waterChartData = [
  {
    name: "Consumed",
    amount: waterIntake,
  },
  {
    name: "Remaining",
    amount: Math.max(2500 - waterIntake, 0),
  },
];

const sleepChartData = [
  {
    name: "Slept",
    hours: sleepDuration,
  },
  {
    name: "Remaining",
    hours: Math.max(8 - sleepDuration, 0),
  },
];

const bmiValue = Number(bmi);

const bmiCategory =
  bmi === "--"
    ? "Not available"
    : bmiValue < 18.5
      ? "Underweight"
      : bmiValue < 25
        ? "Normal range"
        : bmiValue < 30
          ? "Overweight"
          : "Obesity range";
          
const loadFoodEntries = async () => {
  try {
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const result = await getFoodEntries(today);

    setFoodEntries(result.data || []);
    setFoodTotals(
      result.totals || {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
      }
    );
  } catch (error) {
    console.error("Load food entries error:", error);
    setFoodMessage("Food records load nahi ho paaye.");
  }
};

//exercise functions
const loadExercises = async () => {
  try {
    const response = await getExercises();

    setExercises(response.data || []);
    setExerciseTotals(
      response.totals || {
        totalDuration: 0,
        totalCaloriesBurned: 0,
      }
    );
  } catch (error) {
    console.error("Failed to load exercises:", error);
  }
};

const loadWeights = async () => {
  try {
    const response = await getWeights();
    setWeights(response.data || []);
  } catch (error) {
    console.error("Failed to load weights:", error);
  }
};

const mealSummary = ["Breakfast", "Lunch", "Dinner", "Snacks"].map(
  (meal) => {
    const mealFoods = foodEntries.filter(
      (food) => (food.mealType || "Snacks") === meal
    );

    return {
      name: meal,
      calories: mealFoods.reduce(
        (total, food) => total + Number(food.calories || 0),
        0
      ),
      protein: mealFoods.reduce(
        (total, food) => total + Number(food.protein || 0),
        0
      ),
    };
  }
);

const handleFoodChange = (e) => {
  const { name, value } = e.target;

  setFoodForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleAddFood = async (e) => {
  e.preventDefault();
  setFoodMessage("");

  if (!foodForm.foodName.trim() || Number(foodForm.quantity) <= 0 ||
      foodForm.calories === "" || Number(foodForm.calories) < 0) {
    setFoodMessage("Please enter valid food details.");
    return;
  }

  try {
    setFoodLoading(true);

    console.log("Food form data:", foodForm);

    await addFoodEntry({
      ...foodForm,
      foodName: foodForm.foodName.trim(),
      quantity: Number(foodForm.quantity),
      calories: Number(foodForm.calories),
      protein: Number(foodForm.protein || 0),
      carbohydrates: Number(foodForm.carbohydrates || 0),
      fat: Number(foodForm.fat || 0),
    });

    setFoodForm({
      foodName: "",
      quantity: 100,
      calories: "",
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      mealType:"Breakfast",
    });

    await loadFoodEntries();
    setFoodMessage("Food added successfully!");
  } catch (error) {
    console.error("Add food error:", error);
    setFoodMessage(
      error.response?.data?.message || "Unable to add food."
    );
  } finally {
    setFoodLoading(false);
  }
};

const handleAddExercise = async (e) => {
  e.preventDefault();

  try {
    await addExercise({
      ...exerciseForm,
      duration: Number(exerciseForm.duration),
      caloriesBurned: Number(exerciseForm.caloriesBurned),
    });

    setExerciseForm({
      exerciseName: "",
      exerciseType: "Cardio",
      duration: "",
      caloriesBurned: "",
    });

    await loadExercises();
  } catch (error) {
    console.error(
      "Failed to add exercise:",
      error.response?.data || error.message
    );
  }
};

const handleAddWeight = async (e) => {
  e.preventDefault();

  try {
    setWeightMessage("");

    await addWeight({
      weight: Number(weightForm.weight),
    });

    setWeightForm({ weight: "" });
    setWeightMessage("Weight saved successfully!");

    await loadWeights();
  } catch (error) {
    setWeightMessage(
      error.response?.data?.message || "Failed to save weight."
    );
  }
};

const handleDeleteWeight = async (id) => {
  try {
    await deleteWeight(id);
    await loadWeights();
  } catch (error) {
    console.error(
      "Failed to delete weight:",
      error.response?.data || error.message
    );
  }
};

const handleDeleteFood = async (id) => {
  try {
    await deleteFoodEntry(id);
    await loadFoodEntries();
    setFoodMessage("Food deleted successfully!");
  } catch (error) {
    console.error("Delete food error:", error);
    setFoodMessage("Unable to delete food.");
  }
};

const handleDeleteExercise = async (id) => {
  try {
    await deleteExercise(id);
    await loadExercises();
  } catch (error) {
    console.error(
      "Failed to delete exercise:",
      error.response?.data || error.message
    );
  }
};

// AI Diet Plan Generation
const handleGenerateDietPlan = async (e) => {
  e.preventDefault();

  setDietLoading(true);
  setDietError("");
  setDietPlan("");

  try {
    const response = await generateDietPlan({
      ...dietForm,
      age: Number(dietForm.age),
      height: Number(dietForm.height),
      weight: Number(dietForm.weight),
      dailyCalorieTarget: dietForm.dailyCalorieTarget
        ? Number(dietForm.dailyCalorieTarget)
        : undefined,
    });

    setDietPlan(response.dietPlan || "");
  } catch (error) {
    setDietError(
      error.response?.data?.message || "Unable to generate diet plan."
    );
  } finally {
    setDietLoading(false);
  }
};

// AI Workout Plan Generation
const handleGenerateWorkoutPlan = async (e) => {
  e.preventDefault();

  setWorkoutLoading(true);
  setWorkoutError("");
  setWorkoutPlan("");

  try {
    const response = await generateWorkoutPlan({
      ...workoutForm,
      age: Number(workoutForm.age),
      height: Number(workoutForm.height),
      weight: Number(workoutForm.weight),
      availableDays: Number(workoutForm.availableDays),
    });

    setWorkoutPlan(response.workoutPlan || "");
  } catch (error) {
    setWorkoutError(
      error.response?.data?.message || "Unable to generate workout plan."
    );
  } finally {
    setWorkoutLoading(false);
  }
};


  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <h2 className="dashboard-logo">
          HealKaroAI<span></span>
        </h2>

        <p className="sidebar-label">MAIN MENU</p>

        <nav className="dashboard-nav">
          <Link to="/dashboard" className="nav-item active">
            🏠 Dashboard
          </Link>

          <Link to="/profile" className="nav-item">
            👤 My Profile
          </Link>

          <a href="#health-overview" className="nav-item">
            ❤️ Health Overview
          </a>

          <a href="#daily-goals" className="nav-item">
            🎯 Daily Goals
          </a>
        </nav>

        <div className="sidebar-bottom">
          <p>AI-Powered Health Monitoring</p>
          <span>Your health, your priority.</span>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">
              YOUR PERSONAL HEALTH SPACE
            </p>

            <h1>Health Dashboard</h1>

            <p className="dashboard-subtitle">
              Track your health and build healthier habits.
            </p>
          </div>

          <div className="dashboard-avatar">👤</div>
        </header>

        <section className="welcome-banner">
          <div>
            <p className="welcome-label">WELCOME TO HEALKAROAI</p>

            <h2>
              {loading
                ? "Loading your profile..."
                : user?.name
                  ? `Welcome, ${user.name}!`
                  : "Your health journey starts here."}
            </h2>

            <p>
              Monitor your health indicators and work towards your daily goals.
            </p>
          </div>

          <div className="welcome-icon">🌿</div>
        </section>

        {error && (
          <div role="alert" className="profile-error">
            {error}
          </div>
        )}

        {!loading && user && (
          <section className="goals-section">
            <h2>Your Profile Overview</h2>

            <div className="goal-row">
              <span>👤 Name</span>
              <span>{user.name || "Not provided"}</span>
            </div>

            <div className="goal-row">
              <span>📧 Email</span>
              <span>{user.email || "Not provided"}</span>
            </div>

            <div className="goal-row">
              <span>🎂 Age</span>
              <span>{user.age ? `${user.age} years` : "Not provided"}</span>
            </div>

            <div className="goal-row">
              <span>⚧️ Gender</span>
              <span>{user.gender || "Not provided"}</span>
            </div>

            <div className="goal-row">
              <span>📏 Height</span>
              <span>{height > 0 ? `${height} cm` : "Not provided"}</span>
            </div>

            <div className="goal-row">
              <span>⚖️ Weight</span>
              <span>{weight > 0 ? `${weight} kg` : "Not provided"}</span>
            </div>
          </section>
        )}

        <section id="health-overview">
          <div className="section-heading">
            <div>
              <h2>Health Overview</h2>
              <p>Your personal health indicators</p>
            </div>
          </div>

          <div className="health-card-grid">
            {healthCards.map((card) => (
              <article className="health-card" key={card.title}>
                <div className="health-card-icon">{card.icon}</div>

                <p className="health-card-title">{card.title}</p>

                <div className="health-card-value">
                  {loading ? "..." : card.value}
                  <span>{card.unit}</span>
                </div>

                <p className="health-card-description">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </section>

{/* Health Analytics Dashboard */}
<section className="analytics-section">
  <div className="section-heading">
    <div>
      <h2>📊 Health Analytics</h2>
      <p>Your current health progress at a glance</p>
    </div>
  </div>

  {/* BMI Analytics */}
  <div className="analytics-card">
    <h3>⚖️ BMI Analysis</h3>

    <div className="analytics-highlight">
      <span className="analytics-number">{bmi}</span>
      <span className="analytics-unit">kg/m²</span>
    </div>

    <p>
      Category: <strong>{bmiCategory}</strong>
    </p>

    <p className="analytics-note">
      Calculated from your current height and weight.
    </p>
  </div>

  {/* Water Analytics */}
  <div className="analytics-card">
    <h3>💧 Water Intake</h3>

    <div className="analytics-highlight">
      <span className="analytics-number">
        {Math.round((waterIntake / 2500) * 100)}%
      </span>
      <span className="analytics-unit">of daily goal</span>
    </div>

    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={waterChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="amount"
          name="Water (ml)"
          fill="#16a6a1"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>

    <p className="analytics-note">
      Daily reference goal: 2500 ml. Personal water needs vary.
    </p>
  </div>

  {/* Sleep Analytics */}
  <div className="analytics-card">
    <h3>😴 Sleep Analysis</h3>

    <div className="analytics-highlight">
      <span className="analytics-number">
        {sleepDuration}
      </span>
      <span className="analytics-unit">hours</span>
    </div>

    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={sleepChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="hours"
          name="Sleep (hours)"
          fill="#7c6ce0"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>

    <p className="analytics-note">
      Reference goal: 8 hours per night.
    </p>
  </div>
</section>

        {/* Water Intake Tracker */}
<section className="goals-section">
  <h2>💧 Water Intake Tracker</h2>
  <p>Track how much water you drink today.</p>

  <div className="goal-row">
    <span>Today's Intake</span>
    <div className="water-progress-section">
  <div className="water-progress-info">
    <span>🎯 Daily Water Goal</span>
    <strong>2500 ml</strong>
  </div>

  <div className="water-progress-bar">
    <div
      className="water-progress-fill"
      style={{
        width: `${Math.min((waterIntake / 2500) * 100, 100)}%`,
      }}
    />
  </div>
  <p>
    {Math.min(Math.round((waterIntake / 2500) * 100), 100)}% completed
  </p>
  <p>
    {Math.max(2500 - waterIntake, 0)} ml remaining today
  </p>
</div>
    <strong>{waterIntake} ml</strong>
  </div>

  <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
    <button
      disabled={waterLoading}
      onClick={() => handleAddWater(250)}
    >
      +250 ml
    </button>

    <button
      disabled={waterLoading}
      onClick={() => handleAddWater(500)}
    >
      +500 ml
    </button>
  </div>

  {waterError && (
    <p role="alert" style={{ color: "red" }}>
      {waterError}
    </p>
  )}
</section>
{/* Sleep Tracker */}
<section className="goals-section" id="sleep-tracker">
  <h2>😴 Sleep Tracker</h2>
  <p>Track your sleep schedule and daily rest.</p>

  <div className="goal-row">
    <label htmlFor="sleepTime">🌙 Bedtime</label>
    <input
      id="sleepTime"
      type="time"
      value={sleepTime}
      onChange={(e) => setSleepTime(e.target.value)}
    />
  </div>

  <div className="goal-row">
    <label htmlFor="wakeTime">🌅 Wake-up Time</label>
    <input
      id="wakeTime"
      type="time"
      value={wakeTime}
      onChange={(e) => setWakeTime(e.target.value)}
    />
  </div>

  <button
    type="button"
    disabled={sleepLoading}
    onClick={handleSaveSleep}
  >
    {sleepLoading ? "Saving..." : "Save Sleep Record"}
  </button>

  {sleepError && (
    <p role="alert" style={{ color: "red" }}>
      {sleepError}
    </p>
  )}

  <div className="goal-row">
    <span>⏱️ Total Sleep</span>
    <strong>{sleepDuration} hours</strong>
  </div>

  <div className="water-progress-section">
    <div className="water-progress-info">
      <span>🎯 Daily Sleep Goal</span>
      <strong>8 hours</strong>
    </div>

    <div className="water-progress-bar">
      <div
        className="water-progress-fill"
        style={{
          width: `${Math.min((sleepDuration / 8) * 100, 100)}%`,
        }}
      />
    </div>

    <p>
      {Math.min(Math.round((sleepDuration / 8) * 100), 100)}% completed
    </p>
  </div>
</section>
{/* Food Tracker */}
<section className="food-tracker">
  <div className="section-heading">
    <h2>🍎 Food Tracker</h2>
    <p>Track your daily food and nutrition intake.</p>
  </div>

  <form onSubmit={handleAddFood} className="food-form">
    <div className="food-form-grid">
      <input
        type="text"
        name="foodName"
        placeholder="Food name (e.g. Banana)"
        value={foodForm.foodName}
        onChange={handleFoodChange}
        required
      />

      <input
        type="number"
        name="quantity"
        placeholder="Quantity (grams)"
        value={foodForm.quantity}
        onChange={handleFoodChange}
        min="1"
        required
        step="any"
      />

      <input
        type="number"
        name="calories"
        placeholder="Calories (kcal)"
        value={foodForm.calories}
        onChange={handleFoodChange}
        min="0"
        required
        step="any"
      />

      <input
        type="number"
        name="protein"
        placeholder="Protein (g)"
        value={foodForm.protein}
        onChange={handleFoodChange}
        min="0"
        step="any"
      />

      <input
        type="number"
        name="carbohydrates"
        placeholder="Carbs (g)"
        value={foodForm.carbohydrates}
        onChange={handleFoodChange}
        min="0"
        step="any"
      />

      <input
        type="number"
        name="fat"
        placeholder="Fat (g)"
        value={foodForm.fat}
        onChange={handleFoodChange}
        min="0"
        step="any"
      />
      <select
       name="mealType"
       value={foodForm.mealType}
       onChange={handleFoodChange}
      >
       <option value="Breakfast">Breakfast</option>
       <option value="Lunch">Lunch</option>
       <option value="Dinner">Dinner</option>
       <option value="Snacks">Snacks</option>
      </select>
    </div>

    <button type="submit" disabled={foodLoading}>
      {foodLoading ? "Adding..." : "+ Add Food"}
    </button>
  </form>

  {foodMessage && <p className="food-message">{foodMessage}</p>}

{/* Daily Calorie Progress */}
<div className="calorie-progress">
  <h3>Daily Calorie Progress</h3>

  <div className="calorie-info">
    <span>Consumed: {foodTotals.calories} kcal</span>
    <span>
      Target: {healthData?.dailyCalorieTarget || 0} kcal
    </span>
  </div>

  <div className="calorie-progress-bar">
    <div
      className="calorie-progress-fill"
      style={{
        width: `${
          healthData?.dailyCalorieTarget > 0
            ? Math.min(
                (foodTotals.calories /
                  healthData.dailyCalorieTarget) * 100,
                100
              )
            : 0
        }%`,
      }}
    />
  </div>

  <p>
    {healthData?.dailyCalorieTarget > 0
      ? `${Math.max(
          healthData.dailyCalorieTarget - foodTotals.calories,
          0
        )} kcal remaining`
      : "Please calculate your daily calorie target first."}
  </p>
</div>

  <div className="food-totals">
    <h3>Today's Nutrition</h3>
    <div className="food-total-grid">
      <div>
        <strong>{foodTotals.calories}</strong>
        <span>Calories (kcal)</span>
      </div>
      <div>
        <strong>{foodTotals.protein} g</strong>
        <span>Protein</span>
      </div>
      <div>
        <strong>{foodTotals.carbohydrates} g</strong>
        <span>Carbs</span>
      </div>
      <div>
        <strong>{foodTotals.fat} g</strong>
        <span>Fat</span>
      </div>
    </div>
  </div>

{/* Meal-wise Nutrition Summary */}
<div className="meal-summary">
  <h3>🍽️ Meal-wise Nutrition Summary</h3>

  <div className="meal-summary-grid">
    {mealSummary.map((meal) => (
      <div className="meal-summary-card" key={meal.name}>
        <h4>{meal.name}</h4>

        <strong>{meal.calories.toFixed(1)} kcal</strong>

        <p>Protein: {meal.protein.toFixed(1)} g</p>
      </div>
    ))}
  </div>
</div>

  <div className="food-list">
    <h3>Today's Food Entries</h3>

    {foodEntries.length === 0 ? (
      <p>No food entries added yet.</p>
    ) : (
      foodEntries.map((food) => (
        <div className="food-entry" key={food._id}>
          <div>
            <strong>{food.foodName}</strong>
           <p>
              {food.mealType || "Snacks"} · {food.quantity} g · {food.calories} kcal
          </p>
            <small>
              Protein: {food.protein} g | Carbs:{" "}
              {food.carbohydrates} g | Fat: {food.fat} g
            </small>
          </div>

          <button
            type="button"
            onClick={() => handleDeleteFood(food._id)}
          >
            Delete
          </button>
        </div>
      ))
    )}
  </div>
</section>

{/* Exercise Tracker */}
<section className="exercise-tracker">
  <div className="section-heading">
    <h2>🏋️ Exercise Tracker</h2>
    <p>Track your daily workouts and calories burned.</p>
  </div>

  <form onSubmit={handleAddExercise} className="exercise-form">
    <div className="exercise-form-grid">
      <input
        type="text"
        placeholder="Exercise name (e.g. Walking)"
        value={exerciseForm.exerciseName}
        onChange={(e) =>
          setExerciseForm({
            ...exerciseForm,
            exerciseName: e.target.value,
          })
        }
        required
      />

      <select
        value={exerciseForm.exerciseType}
        onChange={(e) =>
          setExerciseForm({
            ...exerciseForm,
            exerciseType: e.target.value,
          })
        }
      >
        <option value="Cardio">Cardio</option>
        <option value="Strength">Strength</option>
        <option value="Yoga">Yoga</option>
        <option value="Sports">Sports</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="number"
        placeholder="Duration (minutes)"
        value={exerciseForm.duration}
        onChange={(e) =>
          setExerciseForm({
            ...exerciseForm,
            duration: e.target.value,
          })
        }
        min="1"
        required
      />

      <input
        type="number"
        placeholder="Calories burned (kcal)"
        value={exerciseForm.caloriesBurned}
        onChange={(e) =>
          setExerciseForm({
            ...exerciseForm,
            caloriesBurned: e.target.value,
          })
        }
        min="0"
        required
      />
    </div>

    <button type="submit">+ Add Exercise</button>
  </form>

  <div className="exercise-totals">
    <div>
      <strong>{exerciseTotals.totalDuration}</strong>
      <span>Minutes</span>
    </div>

    <div>
      <strong>{exerciseTotals.totalCaloriesBurned}</strong>
      <span>Calories Burned</span>
    </div>
  </div>

  <div className="exercise-list">
    <h3>Today's Exercises</h3>

    {exercises.length === 0 ? (
      <p>No exercises added yet.</p>
    ) : (
      exercises.map((exercise) => (
        <div className="exercise-entry" key={exercise._id}>
          <div>
            <strong>{exercise.exerciseName}</strong>
            <p>
              {exercise.exerciseType} · {exercise.duration} minutes
              · {exercise.caloriesBurned} kcal
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleDeleteExercise(exercise._id)}
          >
            Delete
          </button>
        </div>
      ))
    )}
  </div>
</section>

{/* Weight Tracker */}
<section className="weight-tracker">
  <div className="section-heading">
    <h2>⚖️ Weight Tracker</h2>
    <p>Track your daily weight and monitor your progress.</p>
  </div>

  <form onSubmit={handleAddWeight} className="weight-form">
    <input
      type="number"
      placeholder="Enter your weight (kg)"
      value={weightForm.weight}
      onChange={(e) =>
        setWeightForm({...weightForm, weight: e.target.value })
      }
      min="1"
      max="500"
      step="0.1"
      required
    />

    <button type="submit">+ Save Weight</button>
  </form>

  {weightMessage && (
    <p className="weight-message">{weightMessage}</p>
  )}

  <div className="weight-history">
    <h3>Weight History</h3>

    {weights.length === 0 ? (
      <p>No weight records added yet.</p>
    ) : (
      [...weights].reverse().map((entry) => (
        <div className="weight-entry" key={entry._id}>
          <div>
            <strong>{entry.weight} kg</strong>
            <p>{entry.date}</p>
          </div>

          <button
            type="button"
            onClick={() => handleDeleteWeight(entry._id)}
          >
            Delete
          </button>
        </div>
      ))
    )}
  </div>
</section>

       <section id="daily-goals" className="goals-section">
  <div className="section-heading">
    <div>
      <h2>🎯 Daily Health Goals</h2>
      <p>Track your progress using your recorded health data.</p>
    </div>

    <strong>{overallProgress}% completed</strong>
  </div>

  <div className="water-progress-bar">
    <div
      className="water-progress-fill"
      style={{ width: `${overallProgress}%` }}
    />
  </div>

  {goals.map((goal) => (
    <div className="daily-goal-card" key={goal.title}>
      <div className="daily-goal-info">
        <strong>{goal.title}</strong>

        <span>
          {goal.current} / {goal.target}
        </span>
      </div>

      <div className="water-progress-bar">
        <div
          className="water-progress-fill"
          style={{ width: `${goal.progress}%` }}
        />
      </div>

      <p>{goal.progress}% completed</p>
    </div>
))}
</section>

{/* AI Diet Assistant */}
<section className="tracker-section ai-diet-section">
  <h2>🤖 AI Diet Assistant</h2>
  <p>Generate a personalized 7-day diet plan using Gemini AI.</p>

  <form onSubmit={handleGenerateDietPlan}>
    <div className="diet-form-grid">
      <input
        type="number"
        placeholder="Age"
        value={dietForm.age}
        onChange={(e) =>
          setDietForm({ ...dietForm, age: e.target.value })
        }
        required
        min="18"
      />

      <select
        value={dietForm.gender}
        onChange={(e) =>
          setDietForm({ ...dietForm, gender: e.target.value })
        }
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <input
        type="number"
        placeholder="Height (cm)"
        value={dietForm.height}
        onChange={(e) =>
          setDietForm({ ...dietForm, height: e.target.value })
        }
        required
        min="1"
      />

      <input
        type="number"
        placeholder="Weight (kg)"
        value={dietForm.weight}
        onChange={(e) =>
          setDietForm({ ...dietForm, weight: e.target.value })
        }
        required
        min="1"
      />

      <select
        value={dietForm.activityLevel}
        onChange={(e) =>
          setDietForm({ ...dietForm, activityLevel: e.target.value })
        }
      >
        <option value="sedentary">Sedentary</option>
        <option value="lightly_active">Lightly Active</option>
        <option value="moderately_active">Moderately Active</option>
        <option value="very_active">Very Active</option>
        <option value="extra_active">Extra Active</option>
      </select>

      <select
        value={dietForm.goal}
        onChange={(e) =>
          setDietForm({ ...dietForm, goal: e.target.value })
        }
      >
        <option value="weight_gain">Weight Gain</option>
        <option value="weight_loss">Weight Loss</option>
        <option value="maintenance">Maintain Weight</option>
        <option value="muscle_gain">Muscle Gain</option>
      </select>

      <select
        value={dietForm.dietaryPreference}
        onChange={(e) =>
          setDietForm({ ...dietForm, dietaryPreference: e.target.value })
        }
      >
        <option value="vegetarian">Vegetarian</option>
        <option value="non_vegetarian">Non-Vegetarian</option>
        <option value="vegan">Vegan</option>
      </select>

      <input
        type="number"
        placeholder="Daily Calories (optional)"
        value={dietForm.dailyCalorieTarget}
        onChange={(e) =>
          setDietForm({ ...dietForm, dailyCalorieTarget: e.target.value })
        }
        min="1"
      />
    </div>

    <button type="submit" disabled={dietLoading}>
      {dietLoading ? "Generating..." : "Generate Diet Plan"}
    </button>
  </form>

  {dietError && <p className="error-message">{dietError}</p>}

  {dietPlan && (
    <div className="diet-plan-result">
      <h3>Your Personalized Diet Plan</h3>
      <pre>{dietPlan}</pre>
    </div>
  )}
</section>

<section className="tracker-section ai-diet-section">
  <h2>💪 AI Workout Assistant</h2>
  <p>Generate a workout plan based on your fitness goals.</p>

  <form onSubmit={handleGenerateWorkoutPlan} className="diet-form-grid">
    <input
      type="number"
      placeholder="Age"
      min="15"
      value={workoutForm.age}
      onChange={(e) =>
        setWorkoutForm({ ...workoutForm, age: e.target.value })
      }
      required
    />

    <select
      value={workoutForm.gender}
      onChange={(e) =>
        setWorkoutForm({ ...workoutForm, gender: e.target.value })
      }
    >
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>

    <input
      type="number"
      placeholder="Height (cm)"
      min="1"
      value={workoutForm.height}
      onChange={(e) =>
        setWorkoutForm({ ...workoutForm, height: e.target.value })
      }
      required
    />

    <input
      type="number"
      placeholder="Weight (kg)"
      min="1"
      value={workoutForm.weight}
      onChange={(e) =>
        setWorkoutForm({ ...workoutForm, weight: e.target.value })
      }
      required
    />

    <select
      value={workoutForm.fitnessLevel}
      onChange={(e) =>
        setWorkoutForm({ ...workoutForm, fitnessLevel: e.target.value })
      }
    >
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>

    <select
      value={workoutForm.goal}
      onChange={(e) =>
        setWorkoutForm({ ...workoutForm, goal: e.target.value })
      }
    >
      <option value="muscle_gain">Muscle Gain</option>
      <option value="weight_loss">Weight Loss</option>
      <option value="strength">Strength</option>
      <option value="general_fitness">General Fitness</option>
    </select>

    <select
      value={workoutForm.workoutLocation}
      onChange={(e) =>
        setWorkoutForm({ ...workoutForm, workoutLocation: e.target.value })
      }
    >
      <option value="home">Home</option>
      <option value="gym">Gym</option>
    </select>

    <select
      value={workoutForm.availableDays}
      onChange={(e) =>
        setWorkoutForm({ ...workoutForm, availableDays: e.target.value })
      }
    >
      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
        <option key={day} value={day}>
          {day} days per week
        </option>
      ))}
    </select>

    <button type="submit" disabled={workoutLoading}>
      {workoutLoading ? "Generating..." : "Generate Workout Plan"}
    </button>
  </form>

  {workoutError && <p className="error-message">{workoutError}</p>}

  {workoutPlan && (
    <div className="diet-plan-result">
      <h3>Your AI Workout Plan</h3>
      <pre>{workoutPlan}</pre>
    </div>
  )}
</section>

<footer className="dashboard-footer">
  HealKaroAI · AI-Powered Personal Health Monitoring 2026
</footer>

</main>
</div>
);
}
export default Dashboard;