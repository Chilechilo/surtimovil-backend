import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied — Admin only"
  });
};

export const verifySuperUser = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "superuser") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied — Admin or SuperUser only"
  });
};
