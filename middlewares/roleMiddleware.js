// Verifica que tenga token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({
    success: false,
    message: "No token provided"
  });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contiene id y role
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

// SOLO admin
export const verifyAdminOnly = (req, res, next) => {
  if (req.user.role === "admin") return next();

  return res.status(403).json({
    success: false,
    message: "Access denied — Admin only"
  });
};

// Admin y superuser
export const verifyAdminOrSuper = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "superuser") return next();

  return res.status(403).json({
    success: false,
    message: "Access denied — Admin or Superuser only"
  });
};
