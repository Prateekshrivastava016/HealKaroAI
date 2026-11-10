// Calculate BMI
function calculateBMI(weight, height) {
  // height is in cm
  const heightInMeters = height / 100;

  const bmi = weight / (heightInMeters * heightInMeters);

  return Number(bmi.toFixed(2));
}


// Calculate BMR using Mifflin-St Jeor Equation
function calculateBMR(weight, height, age, gender) {
  let bmr;

  if (gender.toLowerCase() === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  return Math.round(bmr);
}


// Calculate TDEE
function calculateTDEE(bmr, activityLevel) {
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };

  const multiplier = activityMultipliers[activityLevel];

  if (!multiplier) {
    throw new Error("Invalid activity level");
  }

  return Math.round(bmr * multiplier);
}


// Calculate daily calorie target
function calculateDailyCalories(tdee, goal) {
  switch (goal.toLowerCase()) {
    case "lose_weight":
      return tdee - 500;

    case "gain_weight":
      return tdee + 300;

    case "maintain_weight":
      return tdee;

    default:
      throw new Error("Invalid goal");
  }
}


// Main health calculator
function calculateHealthMetrics({
  weight,
  height,
  age,
  gender,
  activityLevel,
  goal,
}) {
  const bmi = calculateBMI(weight, height);

  const bmr = calculateBMR(
    weight,
    height,
    age,
    gender
  );

  const tdee = calculateTDEE(
    bmr,
    activityLevel
  );

  const dailyCalorieTarget = calculateDailyCalories(
    tdee,
    goal
  );

  return {
    bmi,
    bmr,
    tdee,
    dailyCalorieTarget,
  };
}


module.exports = {
  calculateHealthMetrics,
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateDailyCalories,
};