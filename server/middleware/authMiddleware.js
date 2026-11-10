const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing.");
      return res.status(500).json({
        success: false,
        message: "Authentication configuration error.",
      });
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (
      !decoded ||
      typeof decoded !== "object" ||
      typeof decoded.userId !== "string"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = protect;