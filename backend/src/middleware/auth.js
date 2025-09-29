import jwt from "jsonwebtoken";

export const authenticateUser = async (req, res, next) => {
  try {
    // ✅ Get token from cookies
    const token = req.cookies.token; 

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to req.user
    req.user = { id: decoded.userId };

    next(); // continue
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};