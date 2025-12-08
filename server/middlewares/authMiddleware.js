import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Toleramos distintas formas de payload
    const userId = decoded.id || decoded._id || decoded.userId;
    const userRole = decoded.role || decoded.userRole || decoded.type;

    req.user = decoded;
    req.userId = userId;
    req.userRole = userRole;

    next();
  } catch (err) {
    console.error("verifyToken error:", err);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
