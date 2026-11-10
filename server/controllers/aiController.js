const DietPlan = require("../models/DietPlan");
const generateDietPlan = async (req, res) => {
  try {
    const {
      age,
      gender,
      height,
      weight,
      activityLevel,
      goal,
      dietaryPreference,
      dailyCalorieTarget,
    } = req.body;

    if (
      !age ||
      !gender ||
      !height ||
      !weight ||
      !activityLevel ||
      !goal
    ) {
      return res.status(400).json({
        message: "Please provide all required health details.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key is not configured.",
      });
    }

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    }
);
    const prompt = `
Create a detailed and practical 7-day Indian diet plan.

User Details:
Age: ${age}
Gender: ${gender}
Height: ${height} cm
Weight: ${weight} kg
Activity Level: ${activityLevel}
Goal: ${goal}
Dietary Preference: ${dietaryPreference || "Not specified"}
Daily Calorie Target: ${dailyCalorieTarget || "Calculate an approximate target"}

Include:

1. A complete Monday to Sunday diet schedule.
2. Breakfast, lunch, evening snack and dinner for each day.
3. Food quantity in grams, cups or pieces.
4. Approximate calories and protein for every meal.
5. Daily total calories and protein.
6. Affordable Indian food options.
7. Vegetarian or non-vegetarian options according to preference.
8. Healthy alternatives for expensive ingredients.
9. Daily water intake guidance.
10. Practical tips to achieve the selected goal.

Use clear headings and tables where helpful.
Keep the plan nutritionally balanced and realistic.
Avoid extreme diets and unsupported medical claims.
Do not invent exact nutritional values; label them as estimates.
Mention that this is general nutrition guidance, not medical advice.
    `;

    let response;

for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        temperature: 0.4,
        maxOutputTokens: 4000,
      },
    });

    break;
  } catch (error) {
    const isTemporary =
      error.status === 503 || error.status === 429;

    if (!isTemporary || attempt === 3) {
      throw error;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, attempt * 2000)
    );
  }
}
console.log(
  "Finish Reason:",
  response.candidates?.[0]?.finishReason
);

console.log(
  "Token Usage:",
  response.usageMetadata
);

console.log(
  "Generated Characters:",
  response.text?.length
);
    const savedPlan = await DietPlan.create({
  user: req.user.userId,
  dietPlan: response.text,
   });

  return res.status(200).json({
  success: true,
  dietPlan: savedPlan.dietPlan,
  planId: savedPlan._id,
});

  } catch (error) {
    console.error("AI Diet Plan Error:", {
    message: error.message,
    status: error.status,
    details: error.errorDetails,
     });

    return res.status(500).json({
      message: "Failed to generate diet plan.",
    });
  }
};
const getSavedDietPlan = async (req, res) => {
  try {
    const savedPlan = await DietPlan.findOne({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      dietPlan: savedPlan ? savedPlan.dietPlan : "",
    });
  } catch (error) {
    console.error("Get Diet Plan Error:", error);

    return res.status(500).json({
      message: "Failed to fetch saved diet plan.",
    });
  }
};
module.exports = { generateDietPlan, getSavedDietPlan, };