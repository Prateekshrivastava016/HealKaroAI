const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      activityLevel,
      goal,
      dietaryPreference,
    } = req.body;

    // Check required fields
// Validate required fields
if (
  typeof name !== "string" ||
  !name.trim() ||
  typeof email !== "string" ||
  !email.trim() ||
  typeof password !== "string" ||
  !password ||
  age === undefined ||
  !gender ||
  height === undefined ||
  weight === undefined ||
  !activityLevel ||
  !goal ||
  !dietaryPreference
) {
  return res.status(400).json({
    message: "All fields are required.",
  });
}

// Validate email
const normalizedEmail = email.trim().toLowerCase();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
  return res.status(400).json({
    message: "Please enter a valid email address.",
  });
}

// Validate password
if (password.length < 8 || password.length > 128) {
  return res.status(400).json({
    message: "Password must be between 8 and 128 characters.",
  });
}

// Validate numeric fields
const numericAge = Number(age);
const numericHeight = Number(height);
const numericWeight = Number(weight);

if (
  !Number.isFinite(numericAge) ||
  numericAge < 13 ||
  numericAge > 100 ||
  !Number.isFinite(numericHeight) ||
  numericHeight < 50 ||
  numericHeight > 250 ||
  !Number.isFinite(numericWeight) ||
  numericWeight < 10 ||
  numericWeight > 300
) {
  return res.status(400).json({
    message: "Please enter valid age, height and weight values.",
  });
}
    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      age: numericAge,
      gender,
      height: numericHeight,
      weight: numericWeight,
      activityLevel,
      goal,
      dietaryPreference,
    });

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        activityLevel: user.activityLevel,
        goal: user.goal,
        dietaryPreference: user.dietaryPreference,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);

    res.status(500).json({
      message: "Server error during registration",
    });
  }
};


// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        activityLevel: user.activityLevel,
        goal: user.goal,
        dietaryPreference: user.dietaryPreference,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Server error during login",
    });
  }
};


// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-passwordHash"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error("Get user error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  register,
  login,
  getMe,
};