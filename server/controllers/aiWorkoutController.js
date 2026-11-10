const WorkoutPlan = require("../models/WorkoutPlan");

const generateWorkoutPlan = async (req, res) => {
  try {
    const {
      age,
      gender,
      height,
      weight,
      fitnessLevel,
      goal,
      workoutLocation,
      availableDays,
    } = req.body;

    if (
      !age ||
      !gender ||
      !height ||
      !weight ||
      !fitnessLevel ||
      !goal ||
      !workoutLocation ||
      !availableDays
    ) {
      return res.status(400).json({
        message: "Please provide all workout details.",
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
    });

    const prompt = `
Create a detailed ${availableDays}-day weekly workout plan.

USER DETAILS:
Age: ${age}
Gender: ${gender}
Height: ${height} cm
Weight: ${weight} kg
Fitness Level: ${fitnessLevel}
Goal: ${goal}
Workout Location: ${workoutLocation}

REQUIREMENTS:

1. Start with a short introduction based on the user's fitness goal.

2. Create a complete weekly schedule.
   - Include all workout days.
   - Include appropriate rest or active recovery days.
   - Respect the available ${availableDays} workout days.

3. For EACH workout day provide:
   - Exercise name.
   - Number of sets.
   - Repetitions or duration.
   - Rest time between sets.
   - Target muscle groups.

4. Include:
   - Warm-up routine (5-10 minutes).
   - Cool-down and stretching.
   - Recovery and sleep recommendations.
   - Basic progression advice.

5. Use practical exercises suitable for ${workoutLocation}.

6. Make the plan suitable for ${fitnessLevel} fitness level.

7. Keep the plan structured, detailed and easy to follow.

8. Avoid extreme workouts and unsafe recommendations.

9. Use clear headings and bullet points.
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

    if (!response?.text) {
      throw new Error("Empty workout plan generated.");
    }

    // Save workout plan in MongoDB
    const savedPlan = await WorkoutPlan.create({
      user: req.user.userId,
      workoutPlan: response.text,
    });

    return res.status(200).json({
      success: true,
      workoutPlan: savedPlan.workoutPlan,
      planId: savedPlan._id,
    });

  } catch (error) {
    console.error("AI Workout Error:", {
      message: error.message,
      status: error.status,
    });

    return res.status(500).json({
      message: "Failed to generate workout plan.",
    });
  }
};


// Fetch latest saved workout plan
const getSavedWorkoutPlan = async (req, res) => {
  try {
    const savedPlan = await WorkoutPlan.findOne({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      workoutPlan: savedPlan ? savedPlan.workoutPlan : "",
    });

  } catch (error) {
    console.error("Get Workout Plan Error:", error);

    return res.status(500).json({
      message: "Failed to fetch saved workout plan.",
    });
  }
};


module.exports = {
  generateWorkoutPlan,
  getSavedWorkoutPlan,
};